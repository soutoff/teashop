import { IsEmail, IsOptional,  IsString, MinLength } from "class-validator";

export class AuthDto {
  @IsOptional()
  @IsString()
  name: string

  @IsString({
    message: 'Это поле обязательно'
  })
  @IsEmail()
  email: string

  @MinLength(6, {
    message: 'Пароль должен содержать не меньше 6 символов!'
  })
  @IsString({
    message: 'Пароль обязателен'
  })
  password: string
}