const COSEECDHAtoPKCS = (cosePublicKey) => {
  const x = cosePublicKey.get(-2);
  const y = cosePublicKey.get(-3);

  const uncompressedPublicKey = Buffer.concat([Buffer.from([0x04]), x, y]);

  const oid = Buffer.from([
    0x06, 0x07, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x02, 0x01,
  ]); // OID for ecPublicKey
  const prime256v1 = Buffer.from([
    0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07,
  ]); // OID for prime256v1

  const subjectPublicKeyInfo = Buffer.concat([
    oid,
    prime256v1,
    Buffer.from([0x03, 0x42, 0x00]),
    uncompressedPublicKey,
  ]);

  return subjectPublicKeyInfo;
};

const ASN1toPEM = (pkcs8) => {
  const base64 = pkcs8.toString("base64");
  let pem = "-----BEGIN PUBLIC KEY-----\n";
  for (let i = 0; i < base64.length; i += 64) {
    pem += base64.slice(i, i + 64) + "\n";
  }
  pem += "-----END PUBLIC KEY-----";
  return pem;
};

module.exports = { COSEECDHAtoPKCS, ASN1toPEM };
