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
export function generateFileKey() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
}
export async function encryptFileKey(fileKey, password) {
  const enc = new TextEncoder();

  // 🔑 Step 1: derive AES key from password
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("cyphervault-salt"), // fixed salt (can improve later)
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );

  // 🔐 Step 2: encrypt FileKey
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    derivedKey,
    enc.encode(fileKey)
  );

  return JSON.stringify({
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted)),
  });
}
export async function getFileHash(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);

  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function decryptFileKey(encryptedFileKey, password) {
  const parsed = JSON.parse(encryptedFileKey);

  const iv = new Uint8Array(parsed.iv);
  const data = new Uint8Array(parsed.data);

  const enc = new TextEncoder();

  // 🔑 derive same key
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("cyphervault-salt"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    derivedKey,
    data
  );

  return new TextDecoder().decode(decrypted);
}