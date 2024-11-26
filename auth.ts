import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/db/firebase";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Por favor, forneça um email e senha.");
        }

        try {
          const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
          const user = userCredential.user;

          return {
            id: user.uid,
            email: user.email,
            token: await user.getIdToken(),
          };
        } catch (error: any) {
          if (error.code === "auth/invalid-credential") {
            throw new Error("As credenciais fornecidas são inválidas.");
          } else if (error.code === "auth/user-not-found") {
            throw new Error("Usuário não encontrado.");
          } else if (error.code === "auth/wrong-password") {
            throw new Error("Senha incorreta.");
          } else {
            throw new Error("Ocorreu um erro ao autenticar. Tente novamente.");
          }
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.token = token.accessToken as string;
      }
      return session;
    },
  },

  secret: "lduR2tm4If7E7hflqmWP7UC/E9jxNNk8zpff1FWAFOs=",
};
