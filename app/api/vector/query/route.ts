import { NextResponse } from "next/server";
import { initPinecone } from "@/lib/pinecone";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { vector, topK = 5 } = await request.json();
    const pinecone = await initPinecone();
    const index = pinecone.Index(process.env.PINECONE_INDEX || "default");
    const resp = await index.query({
      queryRequest: { topK, vector, includeMetadata: true },
    });
    return NextResponse.json({ ok: true, matches: resp.matches });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
