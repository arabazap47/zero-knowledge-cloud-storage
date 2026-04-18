import CryptoJS from "crypto-js";

// 🔑 Generate key from password
export const generateKey = (password, salt) => {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 1000,
  }).toString();
};

// 🔐 Encrypt file
export const encryptFile = async (file, key) => {
  const arrayBuffer = await file.arrayBuffer();
  const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);

  const encrypted = CryptoJS.AES.encrypt(wordArray, key).toString();

  return new Blob([encrypted], { type: "text/plain" });
};

// 🔓 Decrypt file
export const decryptFile = async (blob, key) => {
  const text = await blob.text();

  const decrypted = CryptoJS.AES.decrypt(text, key);

  const words = decrypted.words;
  const sigBytes = decrypted.sigBytes;

  const u8 = new Uint8Array(sigBytes);

  for (let i = 0; i < sigBytes; i++) {
    u8[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
  }

  return new Blob([u8]);
};