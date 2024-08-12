import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor (private jwt: JwtService, private userService: UserService, private prisma: PrismaService) {}

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto)
    const tokens = this.issueTokens(user.id)

    return {user, ...tokens}
  }

  async register(dto: AuthDto) {
    const oldUser = await this.userService.getByEmail(dto.email)

    if (oldUser) throw new BadRequestException('Пользователь уже существует')

    const user = await this.userService.create(dto)
    const tokens = this.issueTokens(user.id)

    return {user, ...tokens}
  }

  // Получение новых токенов
  async getNewTokens(refreshToken: string) {
    // verifyAsync - метод который верефицирует наш токен
    const result = await this.jwt.verifyAsync(refreshToken)

    if (!result) throw new UnauthorizedException('Невалидный refres токен')

    const user = await this.validateUser(dto)
    const tokens = this.issueTokens(user.id)
  
    return {user, ...tokens}

  }

  // Создание токенов 
  issueTokens(userId: string) {
    const data = {id: userId}

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h'
    })

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d'
    })

    return {accessToken, refreshToken}
  }

  // Валидация User
  private async validateUser(dto: AuthDto) {
    const user = await this.userService.getByEmail(dto.email)

    if(!user) throw new NotFoundException('Пользователь не найден')

    return user  
  }

}
