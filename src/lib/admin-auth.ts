import { createHmac, timingSafeEqual } from 'crypto';

export const ADMIN_SESSION_COOKIE = 'admin_session';
const ADMIN_SESSION_TTL_SECONDS = 60 * 60 * 12;

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD?.trim() || '';
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || getAdminPassword();
}

function safeEqual(left: string, right: string) {
  const leftBuf = Buffer.from(left);
  const rightBuf = Buffer.from(right);
  if (leftBuf.length !== rightBuf.length) {
    return false;
  }

  return timingSafeEqual(leftBuf, rightBuf);
}

function signExpiresAt(expiresAt: string) {
  const secret = getSessionSecret();
  return createHmac('sha256', secret).update(expiresAt).digest('hex');
}

export function isAdminAuthConfigured() {
  return Boolean(getAdminPassword());
}

export function verifyAdminPassword(password: string) {
  const expected = getAdminPassword();
  if (!expected) {
    return false;
  }

  return safeEqual(password, expected);
}

export function getAdminSessionMaxAgeSeconds() {
  return ADMIN_SESSION_TTL_SECONDS;
}

export function createAdminSessionToken() {
  const expiresAt = String(Date.now() + ADMIN_SESSION_TTL_SECONDS * 1000);
  const signature = signExpiresAt(expiresAt);
  return `${expiresAt}.${signature}`;
}

export function verifyAdminSessionToken(token: string) {
  if (!token || !getSessionSecret()) {
    return false;
  }

  const [expiresAt, signature] = token.split('.');
  if (!expiresAt || !signature) {
    return false;
  }

  const expires = Number(expiresAt);
  if (!Number.isFinite(expires) || expires < Date.now()) {
    return false;
  }

  const expected = signExpiresAt(expiresAt);
  return safeEqual(signature, expected);
}
