// Minimal stub for an AI vector index used during local dev.
export async function getIndexFromStore() {
  return {
    insert: async (_doc: any) => {
      // no-op
    },
    query: async (_q: string) => {
      return [];
    },
  } as const;
}
