export default class encrypter {

    /**
     * Encrypts text using a simple shift cipher, ensuring UTF-8 compatibility
     * @param {string} text - Plain text to encrypt
     * @param {number} key - Encryption key
     * @returns {string} - UTF-8 compatible encrypted string
     */
    static simpleEncrypt(text, key) {
        // Convert to UTF-8 bytes
        const encoder = new TextEncoder();
        const bytes = encoder.encode(text);
        
        // Apply the cipher (only use values 1-127 to stay in ASCII safe range)
        const shift = key % 126 + 1; // Range 1-127, avoid NULL byte (0)
        let result = "";
        
        for (let i = 0; i < bytes.length; i++) {
            // Keep the result in the printable ASCII range (32-126)
            // by cycling within this range
            let base = 32; // ASCII space character
            let range = 95; // 127-32, printable ASCII range
            
            // Apply the shift within the printable range
            let newByte = ((bytes[i] - base + shift) % range + range) % range + base;
            result += String.fromCharCode(newByte);
        }
        
        return result;
    }

    /**
     * Decrypts text from the simple shift cipher
     * @param {string} cipher - Encrypted text
     * @param {number} key - Encryption key
     * @returns {string} - Decrypted text
     */
    static simpleDecrypt(cipher, key) {
        // Must use the same shift as encrypt
        const shift = key % 126 + 1;
        let bytes = [];
        
        // Decrypt each character
        for (let i = 0; i < cipher.length; i++) {
            let base = 32;
            let range = 95;
            
            let charCode = cipher.charCodeAt(i);
            let originalByte = ((charCode - base - shift) % range + range) % range + base;
            bytes.push(originalByte);
        }
        
        // Convert back to string using UTF-8
        const decoder = new TextDecoder();
        return decoder.decode(new Uint8Array(bytes));
    }
}