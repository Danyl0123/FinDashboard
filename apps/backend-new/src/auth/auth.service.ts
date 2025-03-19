import { BadRequestException, Injectable } from '@nestjs/common';
import * as arg2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { User } from './models/model';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne(email);
    if (user) {
      const passwordIsMath = await arg2.verify(user.password, password);
      return passwordIsMath ? user : null;
    } else {
      throw new BadRequestException('user is not found');
    }
  }

  async validateUserFromGoogle(userDetails: any) {
    const { email, firstName, lastName, picture, googleId } = userDetails;

    let user = await this.userService.findOne(email);

    if (!user) {
      user = await this.userService.createGoogleUser({
        email,
        firstName,
        lastName,
        picture,
        googleId,
        // isGoogleAuth: true,
        // password: await arg2.hash(Math.random().toString(36).slice(-10)),
      });
    } else if (!user.googleId) {
      user = await this.userService.update(user.id, {
        googleId,
        // isGoogleAuth: true,
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        picture: picture || user.picture,
      });
    }

    return user;
  }

  async login(user: User) {
    const { id, email } = user;
    return {
      id,
      email,
      token: this.jwtService.sign({ id: user.id, email: user.email }),
    };
  }
}
