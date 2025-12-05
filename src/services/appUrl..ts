export function getAppUrl(): string {
  const appUrl = import.meta.env.VITE_APP_URL;

  if (!appUrl) {
    throw new Error('VITE_APP_URL is not defined in environment variables.');
  }

  return appUrl.replace(/\/$/, '');
}
