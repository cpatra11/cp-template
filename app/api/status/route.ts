import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { initPinecone } from "@/lib/pinecone";

export async function GET() {
  const status: any = { ok: true };
  // Check MongoDB (Prisma) connection
  try {
    // quick query - read a single user (works with Mongo datasource)
    await prisma.user.findFirst();
    status.mongodb = { ok: true };
  } catch (err) {
    console.error("Prisma ping failed", err);
    status.mongodb = { ok: false, error: String(err) };
    status.ok = false;
  }

  // Check Pinecone
  try {
    const pinecone = await initPinecone();
    // try to list indexes
    const indexes = await pinecone.listIndexes?.();
    status.pinecone = { ok: true, indexes };
  } catch (err) {
    console.error("Pinecone ping failed", err);
    status.pinecone = { ok: false, error: String(err) };
    status.ok = false;
  }

  return NextResponse.json(status);
}
