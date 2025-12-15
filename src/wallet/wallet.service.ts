import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';

/**
 * WalletService contains all business rules.
 * It does NOT deal with HTTP or request/response objects.
 */
@Injectable()
export class WalletService {
  // In-memory storage for wallets
  private wallets = new Map<string, Wallet>();

  // List of all transactions
  private transactions: Transaction[] = [];

  // Stores idempotency keys to prevent duplicate operations
  private idempotencyStore = new Set<string>();

  /**
   * Creates a new wallet with zero balance.
   */
  createWallet(currency: 'USD'): Wallet {
    const wallet = new Wallet(randomUUID(), currency, 0);
    this.wallets.set(wallet.id, wallet);
    return wallet;
  }

  /**
   * Adds money to a wallet.
   */
  fundWallet(walletId: string, amount: number, idempotencyKey?: string): Wallet {
    // Prevent duplicate requests
    if (idempotencyKey && this.idempotencyStore.has(idempotencyKey)) {
      return this.getWallet(walletId);
    }

    const wallet = this.getWallet(walletId);

    // Increase balance
    wallet.balance += amount;

    // Record transaction
    this.transactions.push(
      new Transaction(randomUUID(), 'FUND', amount, undefined, walletId),
    );

    if (idempotencyKey) {
      this.idempotencyStore.add(idempotencyKey);
    }

    return wallet;
  }

  /**
   * Transfers money between wallets.
   */
  transfer(
    fromWalletId: string,
    toWalletId: string,
    amount: number,
    idempotencyKey?: string,
  ): void {
    if (fromWalletId === toWalletId) {
      throw new BadRequestException('Cannot transfer to the same wallet');
    }

    if (idempotencyKey && this.idempotencyStore.has(idempotencyKey)) {
      return;
    }

    const fromWallet = this.getWallet(fromWalletId);
    const toWallet = this.getWallet(toWalletId);

    // Prevent negative balances
    if (fromWallet.balance < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Update balances
    fromWallet.balance -= amount;
    toWallet.balance += amount;

    // Record transaction
    this.transactions.push(
      new Transaction(
        randomUUID(),
        'TRANSFER',
        amount,
        fromWalletId,
        toWalletId,
      ),
    );

    if (idempotencyKey) {
      this.idempotencyStore.add(idempotencyKey);
    }
  }

  /**
   * Fetch a wallet by ID.
   */
  getWallet(walletId: string): Wallet {
    const wallet = this.wallets.get(walletId);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet;
  }

  /**
   * Fetch wallet details along with transaction history.
   */
  getWalletDetails(walletId: string) {
    const wallet = this.getWallet(walletId);

    const history = this.transactions.filter(
      tx => tx.fromWalletId === walletId || tx.toWalletId === walletId,
    );

    return {
      wallet,
      transactions: history,
    };
  }
}
