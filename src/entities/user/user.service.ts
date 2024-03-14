import { Model } from 'mongoose'
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcryptjs'

import User from './schemas/user.schema'
import CreateUserDto from './dto/createUser.dto'
import MailerService from '@/mailer/mailer.service'
import TokenService from '../token/token.service'
import ReturnUserDto from './dto/returnUser.dto'
import updateUserDto from './dto/updateUser.dto'

@Injectable()
export default class UserService {
  private readonly registrationTimeAvailable = 60000 * 3

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailerService: MailerService,
    private readonly tokenService: TokenService,
  ){}

  async removeInactiveUsers(): Promise<void> {
    await this.userModel.deleteMany(
      { password: null, isActive: false, isAuthProvider: false, createdAt: { $lte: +new Date() - this.registrationTimeAvailable }
    })
  }

  async create(createDto: CreateUserDto): Promise<ReturnUserDto> {
    const { email, name } = createDto
    let user = null

    try {
      await this.removeInactiveUsers()

      const existedUser: ReturnUserDto | undefined = await this.userModel.findOne({ email })

      if (existedUser) {
        if (existedUser.isActive) throw new Error('The user with this email is exist')
        else user = (await this.userModel.findOneAndUpdate({ email }, { name }, { new: true })).toObject({ getters: true })
      } else user = (await this.userModel.create(createDto)).toObject({ getters: true })

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...restUser } = user

      const tokens = await this.tokenService.generateTokens({ user: { _id: user._id, email: user.email }, accessTime: 30 })

      await this.mailerService.sendMail({
        to: email,
        subject: 'Registration finishing.',
        html: `
          <p>Hello ${name}, you need to create password for your account.</p>
          <a href='${process.env.CLIENT_HOST}/create-password?token=${tokens.accessToken}'>
            Link for password creating
          </a>
          <p>This link will be expired in 30 minutes.</p>
        `
      })

      return restUser
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async createByProvider({ email, name }: { email: string, name: string }): Promise<ReturnUserDto> {
    try {
      await this.removeInactiveUsers()

      return (await this.userModel.create({ email, name, isAuthProvider: true, isActive: true })).toObject({ getters: true })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async createPassword(password: string, token: string): Promise<ReturnUserDto> {
    try {
      const verified = this.tokenService.verifyToken(token, false)

      const hash = await bcrypt.hash(password, 10)

      return await this.update({ _id: verified.user._id, password: hash, isActive: true })
    } catch (err) {
      throw new BadRequestException('Sorry, this link was expired...')
    }
  }

  async recoverPassword(email: string): Promise<string> {
    try {
      const { user } = await this.getOneByEmail(email)

      if (!user) throw new BadRequestException('Sorry, account with this email does not exist...')
      if (user && !user.isActive) throw new BadRequestException('Your user does not activated! You can not change the password!')
      else {
        const tokens = await this.tokenService.generateTokens({ user: { _id: user._id, email }, accessTime: 30 })

        await this.mailerService.sendMail({
          to: email,
          subject: 'Password recovery.',
          html: `
          <p>Hello ${user.name}, change password for your account.</p>
          <a href='${process.env.CLIENT_HOST}/create-password?token=${tokens.accessToken}'>
            Link for password recovery
          </a>
          <p>This link will be expired in 30 minutes.</p>
        `
        })

        return 'success'
      }
    } catch (error) {
      throw error
    }
  }

  async update(data: updateUserDto): Promise<ReturnUserDto> {
    try {
      const user = await this.userModel.findOneAndUpdate({ _id: data._id }, { ...data }, { new: true, fields: { password: 0 } })

      return user
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async getOneByEmail(email: string): Promise<{password: string | null, user: ReturnUserDto | null}> {
    try {
      const user = await this.userModel.findOne({ email }).lean()

      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...restUser } = user
  
        return { password, user: restUser }
      }

      return { password: null, user: null }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async getAll(): Promise<User[]> {
    try {
      return await this.userModel.find().exec()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
