import { prisma } from '../../database/prisma/client';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthError } from '../../database/prisma/error';

export class AuthService {
  issueAccessToken(payload: any) {
    return jwt.sign(payload, process.env.JWT_SECRET || 'dev', { expiresIn: '15d' });
  }
  issueRefreshToken(payload: any) {
    return jwt.sign(payload, process.env.REFRESH_SECRET || 'dev', { expiresIn: '30d' });
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AuthError('INVALID_CREDENTIALS', 'Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new AuthError('INVALID_CREDENTIALS', 'Invalid credentials');

    const base = { sub: user.id, email: user.email, role: user.role, name: user.name };
    return { accessToken: this.issueAccessToken(base), refreshToken: this.issueRefreshToken({ sub: user.id }) };
  }

  refresh(refreshToken: string) {
    try {
      const payload = jwt.verify(refreshToken, process.env.REFRESH_SECRET || 'dev') as any;
      return { accessToken: this.issueAccessToken({ sub: payload.sub }) };
    } catch {
      throw new AuthError('INVALID_REFRESH', 'Invalid refresh token');
    }
  }
}
