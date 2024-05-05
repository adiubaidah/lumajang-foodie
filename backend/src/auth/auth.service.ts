import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { LoginDto, RegisterDto } from './auth.dto';
import { UserService } from 'src/user/user.service';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private akunService: UserService,
    private prismaService: PrismaService,
  ) {}

  async register(payload: RegisterDto) {
    const { email, name, password } = payload;
    return await this.prismaService.user.create({
      data: {
        email,
        name,
        password: await hash(password, 10),
      },
    });
  }
  async login(payload: LoginDto) {
    const user = await this.validateUser(payload);
    return user;
  }

  async validateUser(payload: LoginDto) {
    const user = await this.akunService.findByEmail(payload.email);

    if (user && (await compare(payload.password, user.password))) {
      const {
        id,
        email,
        role,
        name,
        image,
        // ...result
      } = user;
      return { id, email, role, name, image };
    }
    throw new UnauthorizedException();
  }
}
