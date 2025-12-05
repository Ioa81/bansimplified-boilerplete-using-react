export const redirectByRole = (role?: string) => {
  const elevated = ['admin', 'manager', 'staff'];

  return elevated.includes(role ?? '')
    ? '/dashboard'
    : '/index';
};
