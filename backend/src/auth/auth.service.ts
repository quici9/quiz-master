import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        const refreshExpiration = process.env.JWT_REFRESH_EXPIRATION || '7d';
        return {
            user,
            accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign(payload, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: refreshExpiration as any,
            }),
        };
    }

    async register(registerDto: RegisterDto) {
        const user = await this.usersService.create(registerDto);
        return this.login(user);
    }

    async refresh(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });

            const user = await this.usersService.findById(payload.sub);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            const newPayload = { email: user.email, sub: user.id, role: user.role };
            return {
                accessToken: this.jwtService.sign(newPayload),
            };
        } catch (e) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}
