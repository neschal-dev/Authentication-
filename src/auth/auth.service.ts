import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto.js';
import { UsersService } from '../users/users.service.js';
import { HashingService } from './hashing/hashing.service.js';
import { LoginDto } from './dto/login.dto.js';
import { SafeUser } from '../users/interface/user.interface.js';
import { AuthResult } from './interface/auth-result.interface.js';
import { TokenService } from './token/token.service.js';
import { RefreshTokenService } from './token/refresh-tokens.service.js';

@Injectable()
export class AuthService {
  private dummyHashPassword?: Promise<string>;
  constructor(
    private readonly userService: UsersService,
    private readonly hashService: HashingService,
    private readonly tokenService: TokenService,
    private readonly refreshTokens: RefreshTokenService,
  ) {}

  private getDummyHash() {
    this.dummyHashPassword ??= this.hashService.hash(
      'dummy-password-for-timing',
    );
    return this.dummyHashPassword;
  }

  private async issueTokens(user: SafeUser): Promise<AuthResult> {
    const [accessToken, refresh] = await Promise.all([
      this.tokenService.signAccessToken(user.id),
      this.tokenService.signRefreshToken(user.id),
    ]);

    await this.refreshTokens.save({
      id: refresh.id,
      userId: user.id,
      token: refresh.token,
      expiresAt: refresh.expiresAt,
    });

    return { user, accessToken, refreshToken: refresh.token };
  }
  async registerUser(registerUserDto: RegisterDto): Promise<AuthResult> {
    const existingUser = await this.userService.findUserByEmail(
      registerUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException(
        'A user with this email address already exists.',
      );
    }

    const passwordHash = await this.hashService.hash(registerUserDto.password);
    const user = await this.userService.create({
      fullname: registerUserDto.fullname,
      email: registerUserDto.email,
      passwordHash,
    });

    return this.issueTokens(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResult> {
    const user = await this.userService.findUserByEmail(loginDto.email);

    // Always verify against some hash, so an unknown email costs the same time as a wrong password.
    const hashToCheck = user?.password ?? (await this.getDummyHash());
    const matches = await this.hashService.verify(
      loginDto.password,
      hashToCheck,
    );

    if (!user || !matches) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    // TODO: issue tokens
    const { id, fullname, email, createdAt, updatedAt } = user;
    return await this.issueTokens({
      id,
      fullname,
      email,
      createdAt,
      updatedAt,
    });
  }
}
