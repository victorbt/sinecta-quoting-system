export {};

declare global {
  namespace Express {
    // Tipo mínimo que guardas en req.user (NO importes aquí para evitar ciclos)
    interface UserClaims {
      sub: number;
      email: string;
      role: 'ADMIN' | 'SELLER';
      name?: string;
    }

    interface Request {
      user?: UserClaims;
    }
  }
}