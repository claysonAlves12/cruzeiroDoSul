import NextAuth from "next-auth";
import { authOptions } from "@/auth"; // Supondo que authOptions está em outro arquivo

// Handler para requisições GET (ex.: /providers, /session)
export const GET = NextAuth(authOptions);

// Handler para requisições POST (ex.: /signin)
export const POST = NextAuth(authOptions);
