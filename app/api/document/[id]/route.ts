// Save as: app/api/document/[id]/route.ts
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // In Next.js 15+, params is a Promise
    const { id } = await params;
    const documentId = parseInt(id);

    console.log("📄 Fetching document with ID:", documentId);

    if (isNaN(documentId)) {
      console.log("❌ Invalid ID:", id);
      return NextResponse.json(
        { error: "Invalid document ID" },
        { status: 400 }
      );
    }

    const { data: document, error } = await supabase
      .from("legal_documents")
      .select("id, title, content")
      .eq("id", documentId)
      .single();

    if (error) {
      console.error("❌ Supabase error:", error);
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    if (!document) {
      console.log("❌ No document found with ID:", documentId);
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    console.log("✅ Found document:", document.title);
    return NextResponse.json({ document });
  } catch (error) {
    console.error("❌ Error fetching document:", error);
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 }
    );
  }
}