
const SENSITIVE_HEADERS = [
  "authorization",
  "cookie",
  "set-cookie",
  "x-api-key",
  "api-key",
  "proxy-authorization"
];

export function sanitizeHeaders(headers) {
  const result = {};

  for (const [key, value] of new Headers(headers).entries()) {
    result[key] = SENSITIVE_HEADERS.includes(key.toLowerCase())
      ? "[REDACTED]"
      : value;
  }

  return result;
}
