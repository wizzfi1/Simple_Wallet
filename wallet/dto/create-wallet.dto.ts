import { IsIn } from 'class-validator';

/**
 * DTO defines what data is allowed when creating a wallet.
 * It protects the system from invalid input.
 */
export class CreateWalletDto {
  // Only USD is allowed for this test
  @IsIn(['USD'])
  currency: 'USD';
}
