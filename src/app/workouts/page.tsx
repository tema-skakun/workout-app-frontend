"use client";

import { useState, useEffect } from 'react';
import api from '../../lib/axios';

const YourWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);

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

  return (
    <div>
      <h1>Your Workouts</h1>
      <ul>
        {workouts.map(workout => (
          <li key={workout._id}>{workout.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default YourWorkouts;
