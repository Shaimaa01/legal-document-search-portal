// Save as: app/api/fix-embeddings/route.ts
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

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

export async function POST() {
  let log = '';
  
  try {
    log += '📚 Step 1: Fetching all documents from database...\n';
    
    // Get all documents
    const { data: documents, error: fetchError } = await supabase
      .from('legal_library')
      .select('id, title, content');

    if (fetchError) {
      throw new Error(`Database error: ${fetchError.message}`);
    }

    log += `   Found ${documents?.length || 0} documents\n\n`;

    if (!documents || documents.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No documents found in database',
        log 
      });
    }

    // Process each document
    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      log += `📄 [${i + 1}/${documents.length}] Processing: "${doc.title}"\n`;

      // Combine title and content for better search
      const textToEmbed = `${doc.title}\n\n${doc.content}`;
      
      // Get embedding from HuggingFace
      log += '   🤖 Getting embedding from AI...\n';
      const embedding = await getEmbedding(textToEmbed);
      
      log += `   ✅ Got embedding with ${embedding.length} dimensions\n`;
      
      // Update in database
      log += '   💾 Saving to database...\n';
      const { error: updateError } = await supabase
        .from('legal_library')
        .update({ embedding })
        .eq('id', doc.id);

      if (updateError) {
        log += `   ❌ Error: ${updateError.message}\n\n`;
      } else {
        log += '   ✅ Saved!\n\n';
      }

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Test the results
    log += '\n🧪 Testing the fix...\n';
    const testEmbedding = await getEmbedding("privacy policy");
    
    const { data: testResults } = await supabase.rpc(
      "match_documents",
      {
        query_embedding: testEmbedding,
        match_threshold: -1,
        match_count: 3,
      }
    );

    log += '\n📊 Search test for "privacy policy":\n';
    testResults?.forEach((doc: any, i: number) => {
      log += `   ${i + 1}. ${doc.title} - Score: ${doc.similarity.toFixed(4)}\n`;
    });

    log += '\n\n✅ ALL DONE! Your search should work properly now.\n';
    log += 'You can close this page and go back to searching.\n';

    return NextResponse.json({ success: true, log });

  } catch (error) {
    log += `\n❌ ERROR: ${error instanceof Error ? error.message : String(error)}\n`;
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      log 
    }, { status: 500 });
  }
}