// 🔐 Generate key using password
export async function deriveKey(password, salt) {
  const enc = new TextEncoder();

  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptFileChunks(file, key) {
  const chunkSize = 1024 * 1024; // 1MB
  const chunks = [];

  for (let offset = 0; offset < file.size; offset += chunkSize) {
    const chunk = file.slice(offset, offset + chunkSize);
    const buffer = await chunk.arrayBuffer();

    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      buffer
    );

    chunks.push({
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encrypted)),
    });
  }

  return JSON.stringify(chunks);
}

export async function decryptFileChunks(encryptedJson, key) {
  const chunks = JSON.parse(encryptedJson);

  const decryptedParts = [];

  for (const chunk of chunks) {
    const iv = new Uint8Array(chunk.iv);
    const data = new Uint8Array(chunk.data);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    decryptedParts.push(new Uint8Array(decrypted));
  }

  // merge chunks
  let totalLength = decryptedParts.reduce((sum, arr) => sum + arr.length, 0);
  let merged = new Uint8Array(totalLength);

  let offset = 0;
  for (let part of decryptedParts) {
    merged.set(part, offset);
    offset += part.length;
  }

  return new Blob([merged]);
}