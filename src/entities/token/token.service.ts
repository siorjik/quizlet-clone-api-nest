import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import Token from './schemas/token.schema'
import ReturnTokenDto from './dto/returnToken.dto'
import DeleteResultDto from '@/dto/deleteResult.dto'

@Injectable()
export default class TokenService {
  private readonly accessExpire: number = 3
  private readonly refreshExpire: number = 5

  constructor(private readonly jwtService: JwtService, @InjectModel(Token.name) private tokenModel: Model<Token>) { }

  getExpirationDate(value: number): number {
    return +new Date() + (value * 60000)
  }

  async generateTokens(user: { [k: string]: string | Types.ObjectId }, isRefresh = false): Promise<ReturnTokenDto> {
    const accessToken =
      this.jwtService.sign({ user }, { secret: process.env.ACCESS_SECRET, expiresIn: this.accessExpire + 'm' })
    const refreshToken =
      this.jwtService.sign({ user }, { secret: process.env.REFRESH_SECRET, expiresIn: this.refreshExpire + 'm' })

    if (!isRefresh) {
      await new this.tokenModel({
        token: refreshToken, userId: user._id, expireAt: new Date(this.getExpirationDate(this.refreshExpire))
      }).save()
    }

    return { accessToken, refreshToken, accessExpire: new Date(this.getExpirationDate(this.accessExpire)) }
  }

  verifyToken(token: string, isRefresh = true) {
    try {
      return this.jwtService.verify(token, { secret: isRefresh ? process.env.REFRESH_SECRET : process.env.ACCESS_SECRET })
    } catch (err) {
      throw err
    }
  }

  async updateTokens(refreshToken: string): Promise<ReturnTokenDto> {
    try {
      const result = await this.tokenModel.findOne({ token: refreshToken })

      if(result) {
        const { user } = this.verifyToken(refreshToken)

        const tokens = await this.generateTokens(user, true)

        await this.tokenModel.findByIdAndUpdate(result._id, {
          token: tokens.refreshToken, expireAt: new Date(this.getExpirationDate(this.refreshExpire))
        })

        return tokens
      } else throw new Error()
    } catch (err) {
      if (err.name === 'TokenExpiredError' ) {
        await this.tokenModel.deleteOne({ token: refreshToken })

        throw new UnauthorizedException('Token expired')
      }

      throw new UnauthorizedException('Unexpected error with tokens updating')
    }
  }

  async removeToken(token: string): Promise<DeleteResultDto> {
    try {
      const res = await this.tokenModel.deleteOne({ token })

      if (!res.deletedCount) throw new Error()
      else return res
    } catch (error) {
      throw new UnauthorizedException('Token delete error')
    }
  }
}
