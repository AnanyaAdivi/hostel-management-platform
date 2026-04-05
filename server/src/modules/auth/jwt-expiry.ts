import type { JwtSignOptions } from '@nestjs/jwt';

type ExpiresIn = JwtSignOptions['expiresIn'];

const durationPattern = /^[0-9]+(ms|s|m|h|d|w|y)$/;

export function parseJwtExpiresIn(
  value: string | undefined,
  fallback: ExpiresIn,
): ExpiresIn {
  const trimmed = value?.trim();
  if (!trimmed) return fallback;

  if (/^\d+$/.test(trimmed)) {
    return Number.parseInt(trimmed, 10);
  }

  if (durationPattern.test(trimmed)) {
    return trimmed as ExpiresIn;
  }

  return fallback;
}
