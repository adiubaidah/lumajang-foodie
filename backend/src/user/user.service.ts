import { Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/auth/auth.dto';
import { PrismaService } from 'src/prisma.service';
import bcrypt from 'bcrypt';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async create(payload: RegisterDto) {
    const { email, name, password } = payload;
    return await this.prismaService.user.create({
      data: {
        email,
        name,
        password: await bcrypt.hash(password, 10),
      },
    });
  }

  async update(
    id: string,
    payload: UserDto,
    { image, backgroundImage }: { image: string; backgroundImage: string },
  ) {
    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...payload,
        image,
        backgroundImage,
      },
    });
  }

  async all() {
    return await this.prismaService.user.findMany();
  }

  async findByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }
}
