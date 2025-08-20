import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient;
}

// Minimal ambient module declarations for demo-only imports
declare module "@google/genai" {
  export const GoogleGenAI: any;
  export type LiveServerMessage = any;
  export enum Modality {}
  export type Session = any;
  export type Blob = any;
}

declare module "lit" {
  const _: any;
  export default _;
}
declare module "lit/decorators.js" {
  const _: any;
  export default _;
}
