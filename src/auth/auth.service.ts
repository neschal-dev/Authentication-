import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { UsersService } from '../users/users.service.js';
import { HashingService } from './hashing/hashing.service.js';
import { LoginDto } from './dto/login-user.dto.js';
import { SafeUser } from '../users/interface/user.interface.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly hashService: HashingService,
  ) {}

  async registerUser(registerUserDto: RegisterDto) {
    const existingUser = await this.userService.findUserByEmail(
      registerUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException(
        'A user with this email address already exists.',
      );
    }
    const hashedPassword = await this.hashService.hash(
      registerUserDto.password,
    );

    // TODO:Issue Tokens
    const user =  await this.userService.create({
      fullname: registerUserDto.fullname,
      email: registerUserDto.email,
      passwordHash: hashedPassword,
    });

   
    return user
  }

  async login(loginDto: LoginDto): Promise<SafeUser | null> {
    const user = await this.userService.findUserByEmail(loginDto.email);
    if (!user) {
      throw new NotFoundException('User not Found');
    }

    const correctPassword = await this.hashService.verify(
      loginDto.password,
      user.password,
    );

    if (!correctPassword) {
      throw new UnauthorizedException('Incorrect email or password');
    }
    // TODO:Issue Tokens
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
