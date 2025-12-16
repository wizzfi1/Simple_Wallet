/**
 * Simple in-memory idempotency store.
 * In production, this would be Redis or a database.
 */
export class IdempotencyStore {
  // Stores processed idempotency keys
  private static keys = new Set<string>();

  /**
   * Checks if a key has already been used.
   */
  static has(key: string): boolean {
    return this.keys.has(key);
  }

  /**
   * Marks a key as used.
   */
  static add(key: string): void {
    this.keys.add(key);
  }
}
