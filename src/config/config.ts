import { plainToInstance, Type } from 'class-transformer';
import { IsInt, IsString, Min, MinLength, validateSync } from 'class-validator';

export class Env {
  @IsString()
  @MinLength(1)
  DATABASE_URL!: string;

  @IsString()
  @MinLength(1)
  NODE_ENV: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  PORT: number = 3000;

  @IsString()
  @MinLength(32)
  JWT_ACCESS_SECRET!: string;

  @IsString()
  @MinLength(32)
  JWT_REFRESH_SECRET!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  JWT_ACCESS_TTL_SECONDS!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  JWT_REFRESH_TTL_SECONDS!: number;
}

export function validateEnv(config: Record<string, unknown>): Env {
  const env = plainToInstance(Env, config);
  const errors = validateSync(env, { skipMissingProperties: false });

  if (errors.length > 0) {
    const problems = errors.map(
      (e) =>
        `  - ${e.property}: ${Object.values(e.constraints ?? {}).join(', ')}`,
    );
    throw new Error(`Invalid environment variables:\n${problems.join('\n')}`);
  }
  return env;
}
