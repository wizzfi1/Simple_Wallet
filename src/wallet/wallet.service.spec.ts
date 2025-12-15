import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

/**
 * This test suite verifies WalletService behavior.
 * We test business rules, not HTTP routes.
 */
describe('WalletService', () => {
  let service: WalletService;

  /**
   * Before each test, create a fresh instance of WalletService.
   * This ensures tests do not affect each other.
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletService],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  it('should create a wallet with zero balance', () => {
    const wallet = service.createWallet('USD');

    expect(wallet).toBeDefined();
    expect(wallet.balance).toBe(0);
    expect(wallet.currency).toBe('USD');
  });

  it('should fund a wallet correctly', () => {
    const wallet = service.createWallet('USD');

    const updatedWallet = service.fundWallet(wallet.id, 100);

    expect(updatedWallet.balance).toBe(100);
  });

  it('should transfer money between wallets', () => {
    const sender = service.createWallet('USD');
    const receiver = service.createWallet('USD');

    service.fundWallet(sender.id, 200);
    service.transfer(sender.id, receiver.id, 50);

    expect(service.getWallet(sender.id).balance).toBe(150);
    expect(service.getWallet(receiver.id).balance).toBe(50);
  });

  it('should prevent transfer if balance is insufficient', () => {
    const sender = service.createWallet('USD');
    const receiver = service.createWallet('USD');

    expect(() =>
      service.transfer(sender.id, receiver.id, 100),
    ).toThrow(BadRequestException);
  });

  it('should throw error when wallet does not exist', () => {
    expect(() => service.getWallet('non-existent-id')).toThrow(
      NotFoundException,
    );
  });
});
