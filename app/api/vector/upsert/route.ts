import { NextResponse } from "next/server";
import { initPinecone } from "@/lib/pinecone";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, vector, metadata, title, content } = body;
    const pinecone = await initPinecone();
    const index = pinecone.Index(process.env.PINECONE_INDEX || "default");
    await index.upsert({
      upsertRequest: { vectors: [{ id, values: vector, metadata }] },
    });

    // persist into Mongo via Prisma
    await prisma.document.create({
      data: {
        title,
        content,
        source: metadata?.source ?? null,
        pineconeId: id,
        metadata,
      } as any,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
