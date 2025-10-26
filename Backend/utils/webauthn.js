const base64url = require("base64url");
const crypto = require("crypto");
const cbor = require("cbor");
const { COSEECDHAtoPKCS, ASN1toPEM } = require("./cose-to-pem");

const generateAttestation = (user) => {
  const attestationOptions = {
    challenge: base64url.encode(crypto.randomBytes(32)),
    rp: {
      name: "Expense Tracker",
      id: "localhost",
    },
    user: {
      id: user.id,
      name: user.email,
      displayName: user.fullName,
    },
    pubKeyCredParams: [
      { type: "public-key", alg: -7 }, // ES256
      { type: "public-key", alg: -257 }, // RS256
    ],
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      userVerification: "required",
      requireResidentKey: false,
    },
    timeout: 60000,
    attestation: "direct",
  };

  return attestationOptions;
};

const verifyAttestation = (attestationResponse, challenge) => {
  const decodedAttestation = cbor.decodeFirstSync(
    attestationResponse.attestationObject,
  );
  const { authData } = decodedAttestation;
  const decodedAuthData = cbor.decodeFirstSync(authData);

  const { rpIdHash, flags, signCount, attestedCredentialData, extensions } =
    decodedAuthData;

  const { aaguid, credentialId, credentialPublicKey } = attestedCredentialData;

  const cosePublicKey = cbor.decodeFirstSync(credentialPublicKey);

  const publicKey = COSEECDHAtoPKCS(cosePublicKey);

  const pem = ASN1toPEM(publicKey);

  const clientDataJSON = base64url.decode(attestationResponse.clientDataJSON);
  const {
    type,
    origin,
    challenge: clientChallenge,
  } = JSON.parse(clientDataJSON);

  if (type !== "webauthn.create") {
    throw new Error("Invalid attestation type");
  }

  if (origin !== "http://localhost:3000") {
    throw new Error("Invalid origin");
  }

  if (clientChallenge !== challenge) {
    throw new Error("Invalid challenge");
  }

  const authr = {
    credID: base64url.encode(credentialId),
    fmt: "fido-u2f",
    publicKey: pem,
    counter: signCount,
  };

  return { verified: true, authr };
};

const verifyAssertion = (assertionResponse, challenge, authr) => {
  const clientDataJSON = base64url.decode(assertionResponse.clientDataJSON);
  const {
    type,
    origin,
    challenge: clientChallenge,
  } = JSON.parse(clientDataJSON);

  if (type !== "webauthn.get") {
    throw new Error("Invalid assertion type");
  }

  if (origin !== "http://localhost:3000") {
    throw new Error("Invalid origin");
  }

  if (clientChallenge !== challenge) {
    throw new Error("Invalid challenge");
  }

  const decodedAuthData = cbor.decodeFirstSync(
    assertionResponse.authenticatorData,
  );
  const { rpIdHash, flags, signCount } = decodedAuthData;

  const signature = assertionResponse.signature;
  const authenticatorData = assertionResponse.authenticatorData;

  const verificationData = Buffer.concat([authenticatorData, clientDataJSON]);

  const verify = crypto.createVerify("sha256");
  verify.update(verificationData);

  const verified = verify.verify(authr.publicKey, signature, "base64");

  return { verified, counter: signCount };
};

module.exports = {
  generateAttestation,
  verifyAttestation,
  verifyAssertion,
};
