/**
 * Wallet entity represents a real-world wallet.
 * It holds money and has rules around how it can be used.
 */
export class Wallet {
  constructor(
    // Unique identifier for the wallet
    public readonly id: string,

    // Currency of the wallet (fixed to USD for simplicity)
    public readonly currency: 'USD',

    // Current balance of the wallet
    public balance: number = 0,
  ) {}
}
