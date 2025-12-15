import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

/**
 * WalletModule groups everything related to wallets:
 * - Controller (API layer)
 * - Service (business logic)
 */
@Module({
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
