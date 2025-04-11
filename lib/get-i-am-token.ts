import jwt from "jsonwebtoken";
import fetch from "node-fetch";

export async function getIamToken() {
  const serviceAccountId = process.env.YANDEX_SERVICE_ACCOUNT_ID!;
  const keyId = process.env.YANDEX_KEY_ID!;
  const privateKey = process.env.YANDEX_PRIVATE_KEY!;

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    aud: "https://iam.api.cloud.yandex.net/iam/v1/tokens",
    iss: serviceAccountId,
    iat: now,
    exp: now + 3600, // 1 час
  };

  const jwtToken = jwt.sign(payload, privateKey, { algorithm: "PS256", keyid: keyId });

  const response = await fetch("https://iam.api.cloud.yandex.net/iam/v1/tokens", {
    method: "POST",
    body: JSON.stringify({ jwt: jwtToken }),
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to fetch IAM token: ${JSON.stringify(data)}`);
  }

  return data.iamToken;
}
