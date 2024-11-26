import { getSession } from "next-auth/react";

export async function verifyUserSession() {
  const session = await getSession();

  if (!session || !session.user) {
    throw new Error("Usuário não autenticado.");
  }

  console.log("Usuário autenticado:", session.user);

  // Use apenas propriedades que existem em `session.user`
  return session.user;
}
