import CryptoJS from 'crypto-js';

/**
 * Utility class for PIN hashing and validation
 * Uses SHA-256 hashing algorithm for secure PIN storage
 */
export class PinHashUtils {
  /**
   * Hash a PIN using SHA-256
   * @param pin The PIN to hash (should be a string)
   * @returns The hashed PIN as a hexadecimal string
   */
  public static hashPin(pin: string): string {
    return CryptoJS.SHA256(pin).toString();
  }

  /**
   * Validate a PIN against its hash
   * @param pin The PIN to validate
   * @param hash The stored hash to compare against
   * @returns True if the PIN matches the hash, false otherwise
   */
  public static validatePin(pin: string, hash: string): boolean {
    const hashedPin = this.hashPin(pin);
    return hashedPin === hash;
  }

  /**
   * Check if a PIN meets the required format
   * @param pin The PIN to validate
   * @returns True if the PIN is valid, false otherwise
   */
  public static isValidPinFormat(pin: string): boolean {
    // Check if PIN is exactly 4 digits
    const pinRegex = /^\d{4}$/;
    return pinRegex.test(pin);
  }
}