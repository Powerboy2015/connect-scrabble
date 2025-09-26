export default class encrypter {

    /**
     *  
     * @param {string} text 
     * @param {number} key 
     * @returns string
     */
    static simpleEncrypt(text,key) {
        let result = "";
        for (let i = 0; i < text.length; i++) {
            let charCode = text.charCodeAt(i);
            let shift = key % 256; 
            result += String.fromCharCode((charCode + shift) % 256);
        }
    return result;
    }

    /**
     * 
     * @param {string} cipher 
     * @param {number} key 
     * @returns string
     */
    static simpleDecrypt(cipher, key) {
    let result = "";
    for (let i = 0; i < cipher.length; i++) {
        let charCode = cipher.charCodeAt(i);
        let shift = key % 256;
        result += String.fromCharCode((charCode - shift + 256) % 256);
    }
    return result;
}
}