"use server";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export const listFiles = async () => {
  const files = await utapi.listFiles();

  return files;
};
