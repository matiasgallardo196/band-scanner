export function cleanHex(input: string) {
  return input.toUpperCase().replace(/[^0-9A-F]/g, "");
}

export function xorLrcFromHex(hex: string) {
  const h = cleanHex(hex);
  if (!h || h.length % 2 !== 0) return null;

  let lrc = 0;
  for (let i = 0; i < h.length; i += 2) {
    const b = parseInt(h.slice(i, i + 2), 16);
    if (Number.isNaN(b)) return null;
    lrc ^= b;
  }
  return lrc.toString(16).toUpperCase().padStart(2, "0");
}

export type ScanResult = {
  uid: string;
  lrc: string;
  final: string;
  ok?: boolean;
};

export function buildCodes(hexInput: string): ScanResult | null {
  const uid = cleanHex(hexInput);

  // Case 10 hex: UID (5 bytes) -> calculate LRC and build final
  if (uid.length === 10) {
    const lrc = xorLrcFromHex(uid);
    if (!lrc) return null;
    return { uid, lrc, final: uid + lrc };
  }

  // Case 12 hex: assume UID+LRC
  if (uid.length === 12) {
    const uidPart = uid.slice(0, 10);
    const lrcPart = uid.slice(10, 12);
    const calc = xorLrcFromHex(uidPart);
    return { uid: uidPart, lrc: lrcPart, final: uid, ok: calc === lrcPart };
  }

  // Other lengths: try anyway (in case device sends more bytes)
  if (uid.length >= 8 && uid.length % 2 === 0) {
    const lrc = xorLrcFromHex(uid);
    if (!lrc) return null;
    return { uid, lrc, final: uid + lrc };
  }

  return null;
}
