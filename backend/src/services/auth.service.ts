import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { config } from '../config';
import { ConflictError, UnauthorizedError } from '../utils/errors';
import { JwtPayload } from '../types';

export class AuthService {
  async register(name: string, email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictError('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
    });

    const token = this.generateToken(user.id, user.email);

    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = this.generateToken(user.id, user.email);

    const { password: _, ...safeUser } = user;

    return { user: safeUser, token };
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return user;
  }

  private generateToken(userId: string, email: string): string {
    const payload: JwtPayload = { userId, email };
    const options: SignOptions = {
      expiresIn: config.jwt.expiresIn as SignOptions['expiresIn'],
    };
    return jwt.sign(payload, config.jwt.secret, options);
  }
}

export const authService = new AuthService();
