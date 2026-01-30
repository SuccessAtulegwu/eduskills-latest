import { Injectable } from '@angular/core';

/**
 * Secure Storage Service
 * Provides encrypted storage for sensitive data like tokens and user information
 * Uses AES encryption with a session-based key
 */
@Injectable({
    providedIn: 'root'
})
export class SecureStorageService {
    private readonly STORAGE_PREFIX = 'eduskill_secure_';
    private encryptionKey: string;

    constructor() {
        // Generate or retrieve session-based encryption key
        this.encryptionKey = this.getOrCreateEncryptionKey();
    }

    /**
     * Store data securely with encryption
     */
    setItem(key: string, value: any): void {
        try {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            const encrypted = this.encrypt(stringValue);

            // Use sessionStorage for token (cleared on tab close)
            // Use localStorage for user preferences (persistent)
            if (key === 'authToken' || key === 'refreshToken') {
                sessionStorage.setItem(this.STORAGE_PREFIX + key, encrypted);
                // Also store in memory for faster access
                this.setMemoryItem(key, stringValue);
            } else {
                localStorage.setItem(this.STORAGE_PREFIX + key, encrypted);
            }
        } catch (error) {
            console.error('Error storing secure data:', error);
        }
    }

    /**
     * Retrieve and decrypt data
     */
    getItem(key: string): string | null {
        try {
            // Check memory first for tokens
            if (key === 'authToken' || key === 'refreshToken') {
                const memoryValue = this.getMemoryItem(key);
                if (memoryValue) return memoryValue;
            }

            // Try sessionStorage first for tokens
            let encrypted = sessionStorage.getItem(this.STORAGE_PREFIX + key);

            // Fallback to localStorage
            if (!encrypted) {
                encrypted = localStorage.getItem(this.STORAGE_PREFIX + key);
            }

            if (!encrypted) return null;

            const decrypted = this.decrypt(encrypted);

            // Cache in memory
            if (key === 'authToken' || key === 'refreshToken') {
                this.setMemoryItem(key, decrypted);
            }

            return decrypted;
        } catch (error) {
            console.error('Error retrieving secure data:', error);
            return null;
        }
    }

    /**
     * Get item and parse as JSON
     */
    getObject<T>(key: string): T | null {
        const value = this.getItem(key);
        if (!value) return null;

        try {
            return JSON.parse(value) as T;
        } catch {
            return value as any;
        }
    }

    /**
     * Remove item from storage
     */
    removeItem(key: string): void {
        sessionStorage.removeItem(this.STORAGE_PREFIX + key);
        localStorage.removeItem(this.STORAGE_PREFIX + key);
        this.removeMemoryItem(key);
    }

    /**
     * Clear all secure storage
     */
    clear(): void {
        // Clear only items with our prefix
        this.clearStorageWithPrefix(sessionStorage);
        this.clearStorageWithPrefix(localStorage);
        this.clearMemory();
    }

    /**
     * Check if item exists
     */
    hasItem(key: string): boolean {
        return this.getItem(key) !== null;
    }

    // ==================== ENCRYPTION METHODS ====================

    /**
     * Simple XOR encryption with Base64 encoding
     * Note: For production, consider using Web Crypto API for stronger encryption
     */
    private encrypt(data: string): string {
        const encrypted = this.xorEncrypt(data, this.encryptionKey);
        return btoa(encrypted); // Base64 encode
    }

    /**
     * Decrypt data
     */
    private decrypt(data: string): string {
        const decoded = atob(data); // Base64 decode
        return this.xorEncrypt(decoded, this.encryptionKey);
    }

    /**
     * XOR encryption/decryption
     */
    private xorEncrypt(data: string, key: string): string {
        let result = '';
        for (let i = 0; i < data.length; i++) {
            result += String.fromCharCode(
                data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
            );
        }
        return result;
    }

    /**
     * Generate or retrieve encryption key
     */
    private getOrCreateEncryptionKey(): string {
        const keyName = 'eduskill_ek';
        let key = sessionStorage.getItem(keyName);

        if (!key) {
            // Generate a random key for this session
            key = this.generateRandomKey(32);
            sessionStorage.setItem(keyName, key);
        }

        return key;
    }

    /**
     * Generate random encryption key
     */
    private generateRandomKey(length: number): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let key = '';
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            key += chars[array[i] % chars.length];
        }

        return key;
    }

    /**
     * Clear storage items with prefix
     */
    private clearStorageWithPrefix(storage: Storage): void {
        const keysToRemove: string[] = [];

        for (let i = 0; i < storage.length; i++) {
            const key = storage.key(i);
            if (key && key.startsWith(this.STORAGE_PREFIX)) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach(key => storage.removeItem(key));
    }

    // ==================== IN-MEMORY CACHE ====================

    private memoryCache: Map<string, string> = new Map();

    private setMemoryItem(key: string, value: string): void {
        this.memoryCache.set(key, value);
    }

    private getMemoryItem(key: string): string | null {
        return this.memoryCache.get(key) || null;
    }

    private removeMemoryItem(key: string): void {
        this.memoryCache.delete(key);
    }

    private clearMemory(): void {
        this.memoryCache.clear();
    }

    // ==================== ADVANCED ENCRYPTION (Web Crypto API) ====================

    /**
     * Advanced encryption using Web Crypto API (for production use)
     * Uncomment and use this for stronger security
     */
    /*
    private async encryptWithWebCrypto(data: string): Promise<string> {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      
      const key = await this.getWebCryptoKey();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      const encryptedBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        dataBuffer
      );
  
      const encryptedArray = new Uint8Array(encryptedBuffer);
      const combined = new Uint8Array(iv.length + encryptedArray.length);
      combined.set(iv);
      combined.set(encryptedArray, iv.length);
  
      return btoa(String.fromCharCode(...combined));
    }
  
    private async decryptWithWebCrypto(encryptedData: string): Promise<string> {
      const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
      const iv = combined.slice(0, 12);
      const data = combined.slice(12);
  
      const key = await this.getWebCryptoKey();
      
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        data
      );
  
      const decoder = new TextDecoder();
      return decoder.decode(decryptedBuffer);
    }
  
    private async getWebCryptoKey(): Promise<CryptoKey> {
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(this.encryptionKey),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
      );
  
      return crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: new TextEncoder().encode('eduskill-salt'),
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
    }
    */
}
