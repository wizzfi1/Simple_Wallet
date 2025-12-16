import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { TransferWalletDto } from './dto/transfer-wallet.dto';

/**
 * WalletController handles HTTP requests
 * and delegates logic to WalletService.
 */
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  /**
   * Create a new wallet.
   */
  @Post()
  createWallet(@Body() dto: CreateWalletDto) {
    return this.walletService.createWallet(dto.currency);
  }

  /**
   * Fund a wallet.
   * Supports idempotency via Idempotency-Key header.
   */
  @Post(':id/fund')
  fundWallet(
    @Param('id') id: string,
    @Body() dto: FundWalletDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.walletService.fundWallet(
      id,
      dto.amount,
      idempotencyKey,
    );
  }

  /**
   * Transfer funds between wallets.
   * Also supports idempotency.
   */
  @Post('transfer')
  transfer(
    @Body() dto: TransferWalletDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    this.walletService.transfer(
      dto.fromWalletId,
      dto.toWalletId,
      dto.amount,
      idempotencyKey,
    );

    return { status: 'success' };
  }

  /**
   * Fetch wallet details and transaction history.
   */
  @Get(':id')
  getWallet(@Param('id') id: string) {
    return this.walletService.getWalletDetails(id);
  }
}
