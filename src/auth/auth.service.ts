import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { error } from 'console';
import { PrismaService } from 'src/prisma.service';
import { AuthBody } from './auth.controller';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async login({ authBody }: { authBody: AuthBody }) {
    const { email, password } = authBody;

    const hashPassword = await this.hashPassword({ password });
    console.log(hashPassword);

    const existUser = await this.prismaService.user.findUnique({
      where: {
        email: email,
      }
    });

    if (!existUser) {
      throw new error("L'utilisateur n'existe pas");
    }

    const isPasswordValid = await this.isValid({password, passwordHashed: existUser.password})

    if (!isPasswordValid) {
      throw new error('Mot de passe incorrect');
    }

    return existUser;
  }

  private async hashPassword({ password }: { password: string }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  private async isValid({
    password,
    passwordHashed,
  }: {
    password: string;
    passwordHashed: string;
  }) {
    return await bcrypt.compare(password, passwordHashed);
  }
}
