// next-auth.d.ts
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      token: string;
    }
  }

  interface User {
    id: string;
    token: string;
  }

}

export interface User {
  id: string; 
  token: string; 
  refreshToken: string;
}