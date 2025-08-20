// Minimal stub for ai-engine loader used during local development.
export async function getDocuments(_url: string) {
  // In the real implementation this would download and split the PDF into docs.
  // Return an empty array so upload processing is a no-op during build/dev.
  return [] as Array<{
    id?: string;
    text: string;
    metadata?: Record<string, unknown>;
  }>;
}
