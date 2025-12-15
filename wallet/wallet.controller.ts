import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { TransferWalletDto } from './dto/transfer-wallet.dto';

/**
 * WalletController handles HTTP requests.
 * It delegates all logic to the service.
 */
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // Create a new wallet
  @Post()
  createWallet(@Body() dto: CreateWalletDto) {
    return this.walletService.createWallet(dto.currency);
  }

  // Add money to a wallet
  @Post(':id/fund')
  fundWallet(@Param('id') id: string, @Body() dto: FundWalletDto) {
    return this.walletService.fundWallet(id, dto.amount, dto.idempotencyKey);
  }

  // Transfer money between wallets
  @Post('transfer')
  transfer(@Body() dto: TransferWalletDto) {
    this.walletService.transfer(
      dto.fromWalletId,
      dto.toWalletId,
      dto.amount,
      dto.idempotencyKey,
    );

    return { status: 'success' };
  }

  // Fetch wallet details and transaction history
  @Get(':id')
  getWallet(@Param('id') id: string) {
    return this.walletService.getWalletDetails(id);
  }
}
