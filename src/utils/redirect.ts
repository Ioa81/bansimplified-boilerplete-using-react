import { getAppUrl } from '@/services/appUrl.';

export function buildRedirect(path: string): string {
  const safePath = path.startsWith('/') ? path : `/${path}`;
  return `${getAppUrl()}${safePath}`;
}
