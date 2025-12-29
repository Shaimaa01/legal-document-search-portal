import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

type LibraryDocument = {
  title: string;
  content: string;
  similarity: number | null;
};

async function getEmbedding(text: string): Promise<number[]> {
  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    }
  );

  if (!response.ok) {
    throw new Error(`HuggingFace API error: ${await response.text()}`);
  }

  const result = await response.json();
  return Array.isArray(result[0]) ? result[0] : result;
}

async function getAIAnswer(
  question: string,
  documents: LibraryDocument[]
): Promise<string> {
  // Build context from documents
  const context = documents
    .slice(0, 3) // Use top 3 most relevant docs
    .map((doc) => `Document: ${doc.title}\n${doc.content.slice(0, 500)}...`)
    .join("\n\n");

  const systemPrompt = `You are a helpful legal assistant. Based on the following legal documents, provide a brief, clear answer to the user's question. Keep your answer to 2-3 sentences maximum. Be direct and helpful.

LEGAL DOCUMENTS:
${context}`;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: question,
            },
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", errorText);
      return "";
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error getting AI answer:", error);
    return "";
  }
}

export async function POST(req: Request) {
  console.log("\n🔥 API ROUTE HIT");

  try {
    const body = await req.json();
    const prompt = body.prompt;

    console.log("📝 Prompt:", prompt);

    if (!prompt) {
      return NextResponse.json(
        { error: "No prompt provided" },
        { status: 400 }
      );
    }

    // Get embedding
    console.log("🤖 Calling HuggingFace...");
    const embedding = await getEmbedding(prompt);
    console.log("✅ Got embedding with", embedding.length, "dimensions");

    // Search documents
    console.log("🔍 Searching Supabase...");
    const { data: allDocuments, error: searchError } = await supabase.rpc(
      "match_library_documents",
      {
        query_embedding: embedding,
        match_threshold: -1,
        match_count: 10,
      }
    );

    if (searchError) {
      console.error("❌ Supabase error:", searchError);
      return NextResponse.json(
        {
          error: "Database search failed",
          details: searchError.message,
        },
        { status: 500 }
      );
    }

    const documents = (allDocuments || []) as LibraryDocument[];
    const MIN_SIMILARITY = 0.3;
    const relevantDocs = documents
      .filter((doc) => (doc.similarity ?? 0) >= MIN_SIMILARITY)
      .slice(0, 5);

    console.log(`📊 Found ${relevantDocs.length} relevant documents`);

    // Get AI answer if we have relevant documents
    let aiAnswer = "";
    if (relevantDocs.length > 0) {
      console.log("🧠 Getting AI answer from Groq...");
      aiAnswer = await getAIAnswer(prompt, relevantDocs);
      console.log("✅ AI answer generated:", aiAnswer.slice(0, 100) + "...");
    }

    if (relevantDocs.length > 0) {
      console.log("📈 Top results:");
      relevantDocs.forEach((doc, i) => {
        console.log(
          `   ${i + 1}. ${doc.title} - Score: ${
            doc.similarity?.toFixed(4) || "N/A"
          }`
        );
      });
    }

    return NextResponse.json({
      documents: relevantDocs,
      aiAnswer: aiAnswer,
      count: relevantDocs.length,
      totalFound: documents.length,
    });
  } catch (error) {
    console.error("\n❌ ERROR:", error);
    return NextResponse.json(
      {
        error: "Search failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
