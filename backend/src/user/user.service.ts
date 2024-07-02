import { ForbiddenException, Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/auth/auth.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserDto } from './user.dto';
import { Prisma, Role, User } from '@prisma/client';
import { MessageEvent } from 'src/message/message.event';
@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private messageEvent: MessageEvent,
  ) {}

  async checkOnline(id: string) {
    return { userId: id, online: !!this.messageEvent.users[id] };
  }

  async unregister(id: string) {
    const clientId = this.messageEvent.users[id];
    this.messageEvent.server.to(clientId).disconnectSockets();
    delete this.messageEvent.users[id];
    this.messageEvent.server.emit(`user-${id}:status`, {
      userId: id,
      online: false,
    });
    return { userId: id, online: false };
  }

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
    { image, backgroundImage }: { image?: string; backgroundImage?: string },
  ) {
    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...payload,
        image: image || undefined,
        backgroundImage: backgroundImage || undefined,
      },
    });
  }

  async all({
    q,
    isActive,
    role,
    currentUser,
  }: {
    q: string;
    isActive: number;
    role?: Role;
    currentUser: User;
  }) {
    const filterOptions = {};
    if (isActive) {
      filterOptions['isActive'] = isActive === 1;
    }

    if (!!role) {
      filterOptions['role'] = role;
    }
    const whereClause: Prisma.UserWhereInput = { ...filterOptions };
    if (!!q) {
      whereClause.OR = [
        {
          name: {
            contains: q,
            mode: 'insensitive',
          },
        },
      ];
      if (currentUser.role === 'admin') {
        whereClause.OR.push({
          email: {
            startsWith: q,
          },
        });
      }
    }

    if (currentUser.role !== 'admin') {
      // if it user is foodie or owner
      whereClause.id = {
        not: currentUser.id,
      };
      whereClause.role = {
        not: 'admin',
      };
    }

    return await this.prismaService.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        isActive: true,
        role: true,
        name: true,
        image: true,
      },
    });
  }
  async find(userId: string) {
    const result = await this.prismaService.user.findUnique({
      where: {
        id: userId,
        NOT: {
          role: 'admin',
        },
      },
      select: {
        id: true,
        name: true,
        backgroundImage: true,
        email: true,
        gender: true,
        description: true,
        image: true,
        role: true,
        isPrivate: true,
        subdistrictId: true,
        subdistrict: true,
        _count: {
          select: {
            placeReviews: true,
            menuReviews: true,
            ownerPlaces: true,
            followers: true,
            following: true,
          },
        },
      },
    });
    return result;
  }

  async findByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }
  //create service to change password
  async changePassword({
    oldPassword,
    newPassword,
    userId,
  }: {
    oldPassword: string;
    newPassword: string;
    userId: string;
  }) {
    //user must provide old password newPassword change password
    const checkOldPassword = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
    const check = await bcrypt.compare(oldPassword, checkOldPassword.password);
    if (!check) {
      throw new ForbiddenException('Password lama salah');
    }
    return await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        password: await bcrypt.hash(newPassword, 10),
      },
      select: {
        id: true,
        image: true,
        name: true,
        email: true,
      },
    });
  }
}
