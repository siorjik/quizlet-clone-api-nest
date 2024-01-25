import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { config } from 'dotenv'

config({ path: `.env.${process.env.NODE_ENV}` })

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_SECRET,
      //passReqToCallback: true
    })
  }

  async validate(payload: { user: {_id: string, email: string } }) {
    return { ...payload }
  }
}
