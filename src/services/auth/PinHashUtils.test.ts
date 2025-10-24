import { PinHashUtils } from './PinHashUtils';

describe('PinHashUtils', () => {
  describe('hashPin', () => {
    it('should hash a PIN consistently', () => {
      const pin = '1234';
      const hash1 = PinHashUtils.hashPin(pin);
      const hash2 = PinHashUtils.hashPin(pin);

      expect(hash1).toBe(hash2);
      expect(hash1).toMatch(/^[a-f0-9]{64}$/); // SHA-256 produces 64 hex characters
    });

    it('should produce different hashes for different PINs', () => {
      const pin1 = '1234';
      const pin2 = '5678';
      const hash1 = PinHashUtils.hashPin(pin1);
      const hash2 = PinHashUtils.hashPin(pin2);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('validatePin', () => {
    it('should validate correct PIN', () => {
      const pin = '1234';
      const hash = PinHashUtils.hashPin(pin);
      const isValid = PinHashUtils.validatePin(pin, hash);

      expect(isValid).toBe(true);
    });

    it('should reject incorrect PIN', () => {
      const pin = '1234';
      const wrongPin = '5678';
      const hash = PinHashUtils.hashPin(pin);
      const isValid = PinHashUtils.validatePin(wrongPin, hash);

      expect(isValid).toBe(false);
    });
  });

  describe('isValidPinFormat', () => {
    it('should validate 4-digit PINs', () => {
      expect(PinHashUtils.isValidPinFormat('1234')).toBe(true);
      expect(PinHashUtils.isValidPinFormat('0000')).toBe(true);
      expect(PinHashUtils.isValidPinFormat('9999')).toBe(true);
    });

    it('should reject PINs that are not exactly 4 digits', () => {
      expect(PinHashUtils.isValidPinFormat('123')).toBe(false);   // Too short
      expect(PinHashUtils.isValidPinFormat('12345')).toBe(false); // Too long
      expect(PinHashUtils.isValidPinFormat('abcd')).toBe(false);  // Not digits
      expect(PinHashUtils.isValidPinFormat('12a4')).toBe(false);  // Contains letter
      expect(PinHashUtils.isValidPinFormat('')).toBe(false);      // Empty
    });
  });
});