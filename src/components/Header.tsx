"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header>
      <h1>Workout App</h1>
      {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
    </header>
  );
};

export default Header;
