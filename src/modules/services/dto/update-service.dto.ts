import { IsOptional } from 'class-validator';

export class UpdateServiceDto {
  @IsOptional()
  name: string;

  @IsOptional()
  image: string;
}
