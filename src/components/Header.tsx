"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from './Navbar';

const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header>
      {isLoggedIn && (
        <>
          <Navbar />
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </header>
  );
};

export default Header;
