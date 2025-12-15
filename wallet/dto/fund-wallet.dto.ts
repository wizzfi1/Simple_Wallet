import { IsNumber, IsPositive, IsOptional, IsString } from 'class-validator';

/**
 * DTO for funding a wallet.
 */
export class FundWalletDto {
  // Amount must be a positive number
  @IsNumber()
  @IsPositive()
  amount: number;

  // Optional idempotency key to prevent duplicate funding
  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}
