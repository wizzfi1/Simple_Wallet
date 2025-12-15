/**
 * A transaction records every money movement.
 * This is important for auditing and transparency.
 */
export class Transaction {
  constructor(
    // Unique ID of the transaction
    public readonly id: string,

    // Type of transaction: funding or transfer
    public readonly type: 'FUND' | 'TRANSFER',

    // Amount of money involved
    public readonly amount: number,

    // Wallet sending money (only for transfers)
    public readonly fromWalletId?: string,

    // Wallet receiving money
    public readonly toWalletId?: string,

    // Timestamp when transaction happened
    public readonly createdAt: Date = new Date(),
  ) {}
}
