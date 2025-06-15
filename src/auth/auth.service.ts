import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private users: UserService,
    private jwt: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(email: string, password: string) {
    const user = await this.users.create(email, password);
    return this.generateTokens(user.id);
  }

  async login(email: string, password: string) {
    const user = await this.users.validateUser(email, password);
    if (!user) throw new UnauthorizedException();
    return this.generateTokens(user.id);
  }

  async refresh(refreshToken: string) {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken },
    });
    if (!session || session.revokedAt) throw new UnauthorizedException();
    return this.generateTokens(session.userId, session);
  }

  private async generateTokens(userId: number, session?: { id: number }) {
    const accessToken = await this.jwt.signAsync({ sub: userId });
    const refreshToken = Math.random().toString(36).slice(2);
    if (session) {
      await this.prisma.session.update({
        where: { id: session.id },
        data: { refreshToken },
      });
    } else {
      await this.prisma.session.create({
        data: { userId, refreshToken },
      });
    }
    return { accessToken, refreshToken };
  }
}
