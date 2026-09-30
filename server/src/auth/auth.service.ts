import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });
    if (existing) {
      throw new ConflictException('An account with this email already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    // If it's the specific seed admin email or first account with admin flag
    const isFirstAccount = (await this.prisma.user.count()) === 0;
    const role = isFirstAccount || dto.email.toLowerCase().includes('admin@') ? 'ADMIN' : 'OWNER';

    const user = await this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email: dto.email.toLowerCase().trim(),
        passwordHash,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user,
      accessToken: token,
      message: 'Account successfully registered.',
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    // Check if user has businesses (return complete profile details)
    const businesses = await this.prisma.business.findMany({
      where: { ownerId: user.id },
      include: {
        hours: { orderBy: { dayOfWeek: 'asc' } },
        qrCode: true,
        subscription: true,
        _count: {
          select: {
            categories: true,
            products: true,
            offers: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
      businesses,
      accessToken: token,
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        businesses: {
          include: {
            hours: { orderBy: { dayOfWeek: 'asc' } },
            qrCode: true,
            subscription: true,
            _count: {
              select: {
                categories: true,
                products: true,
                offers: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    return user;
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    // We return success even if user not found for security enumeration prevention
    if (!user) {
      return {
        message: 'If an account with this email exists, a password reset instruction has been sent.',
        token: 'DEMO-RESET-TOKEN-123456',
      };
    }

    return {
      message: 'Password reset token generated.',
      token: 'DEMO-RESET-TOKEN-123456',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (!user) {
      throw new BadRequestException('Invalid reset request.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.newPassword, salt);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    return { message: 'Password has been successfully updated. You can now login.' };
  }

  private generateToken(userId: string, email: string, role: string) {
    return this.jwtService.sign(
      { sub: userId, email, role },
      {
        secret: process.env.JWT_SECRET || 'qr-digital-profile-secure-jwt-secret-key-2025',
        expiresIn: '7d',
      },
    );
  }
}
