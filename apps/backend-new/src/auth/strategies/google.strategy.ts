import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3001/api/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ): Promise<any> {
    try {
      const email =
        profile.emails && profile.emails.length > 0
          ? profile.emails[0].value
          : '';

      const firstName = profile.name?.givenName || '';
      const lastName = profile.name?.familyName || '';
      const photo =
        profile.photos && profile.photos.length > 0
          ? profile.photos[0].value
          : '';

      const userDetails = {
        email,
        firstName,
        lastName,
        picture: photo,
        googleId: profile.id,
        accessToken,
      };

      const user = await this.authService.validateUserFromGoogle(userDetails);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
