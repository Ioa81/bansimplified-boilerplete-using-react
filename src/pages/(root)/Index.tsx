import { useLogout } from '@/hooks/useLogout';

const Index = () => {
  const logout = useLogout();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Index</h1>

      <p>Welcome to the homepage.</p>

      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
      >
        Logout
      </button>
    </div>
  );
};

export default Index;
