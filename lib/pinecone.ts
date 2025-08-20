let cachedClient: any = null;

export async function initPinecone() {
  if (cachedClient) return cachedClient;

  // Dynamically import to avoid module evaluation issues during Next build
  try {
    const PineconePkg: any = await import("@pinecone-database/pinecone");
    const Ctor =
      PineconePkg.PineconeClient ?? PineconePkg.default ?? PineconePkg;
    const client = typeof Ctor === "function" ? new Ctor() : Ctor;

    const apiKey = process.env.PINECONE_API_KEY;
    const environment = process.env.PINECONE_ENVIRONMENT;
    if (!apiKey || !environment)
      throw new Error("PINECONE_API_KEY or PINECONE_ENVIRONMENT missing");

    if (typeof client.init === "function") {
      await client.init({ apiKey, environment });
    }

    cachedClient = client;
    return cachedClient;
  } catch (err) {
    console.error("Failed to initialize Pinecone client", err);
    throw err;
  }
}
