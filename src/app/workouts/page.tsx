"use client";

import { useState, useEffect } from 'react';
import api from '@/api/axios';
import Link from 'next/link';

interface Workout {
  _id: string;
  name: string;
  duration: number;
}

const YourWorkoutsPage = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkouts = async () => {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/workouts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkouts(response.data);
    };

    fetchWorkouts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/api/workouts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkouts(workouts.filter(workout => workout._id !== id));
    } catch (err) {
      setError('Failed to delete workout. Please try again.');
    }
  };

  return (
    <div>
      <h1>Your Workouts</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {workouts.map(workout => (
          <li key={workout._id}>
            <Link href={`/train-workout/${workout._id}`}>
              {workout.name}
            </Link>
            {/*<button onClick={() => handleEdit(workout._id)}>Edit</button>*/}
            <button onClick={() => handleDelete(workout._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default YourWorkoutsPage;
