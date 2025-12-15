import { Module } from '@nestjs/common';
import { WalletModule } from './wallet/wallet.module';

/**
 * AppModule is the root module of the application.
 * All feature modules are imported here.
 */
@Module({
  imports: [
    // WalletModule contains all wallet-related logic
    WalletModule,
  ],
})
export class AppModule {}
