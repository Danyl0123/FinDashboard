import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as arg from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (existUser) throw new BadRequestException('This email already exists');

    const user = await this.userRepository.save({
      email: createUserDto.email,
      password: await arg.hash(createUserDto.password),
    });

    const token = this.jwtService.sign({
      id: user.id,
      email: createUserDto.email,
    });

    return { user, token };
  }

  // Новый метод для создания или обновления пользователя с Google OAuth
  async createGoogleUser(userData: {
    email: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
    googleId: string;
  }) {
    const existUser = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (existUser) {
      if (!existUser.googleId) {
        await this.userRepository.update(existUser.id, {
          googleId: userData.googleId,
          firstName: userData.firstName || existUser.firstName,
          lastName: userData.lastName || existUser.lastName,
          picture: userData.picture || existUser.picture,
        });

        return await this.userRepository.findOne({
          where: { id: existUser.id },
        });
      }
      return existUser;
    }

    const randomPassword = Math.random().toString(36).slice(-10);

    const newUser = await this.userRepository.save({
      email: userData.email,
      password: await arg.hash(randomPassword),
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      picture: userData.picture || '',
      googleId: userData.googleId,
    });

    return newUser;
  }

  async update(id: number, createUserDto) {
    const existUser = this.userRepository.findOne({
      where: { id },
    });

    const newUser = { ...existUser, ...createUserDto };

    await this.userRepository.update(id, newUser);
    return await this.userRepository.findOne({ where: { id } });
  }

  async findOne(email: string) {
    return await this.userRepository.findOne({ where: { email } });
  }
}
