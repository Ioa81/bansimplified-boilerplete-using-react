function getAppUrl(): string {
  const appUrl = import.meta.env.VITE_APP_URL;

  if (!appUrl) {
    throw new Error('VITE_APP_URL is not defined in environment variables.');
  }

  return appUrl.replace(/\/$/, '');
}

export function buildRedirect(path: string): string {
  const safePath = path.startsWith('/') ? path : `/${path}`;
  return `${getAppUrl()}${safePath}`;
}

export const redirectByRole = (role?: string) => {
  const elevated = ['admin', 'manager', 'staff'];

  return elevated.includes(role ?? '')
    ? '/dashboard'
    : '/index';
};

