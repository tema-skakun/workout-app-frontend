"use client";

import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <nav>
      <button onClick={() => handleNavigate('/workouts')}>Your Workouts</button>
      <button onClick={() => handleNavigate('/create-workout')}>Create Workout</button>
    </nav>
  );
};

export default Navbar;
