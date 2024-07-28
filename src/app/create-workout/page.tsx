"use client";

import { useState, useEffect } from 'react';
import api from '../../lib/axios';

const CreateWorkout = () => {
  const [name, setName] = useState('');
  const [exercises, setExercises] = useState([{ name: '' }]);
  const [error, setError] = useState('');

  const handleAddExercise = () => {
    setExercises([...exercises, { name: '' }]);
  };

  const handleExerciseChange = (index: number, value: string) => {
    const newExercises = exercises.slice();
    newExercises[index].name = value;
    setExercises(newExercises);
  };

  const handleCreateWorkout = async () => {
    setError('');
    if (!name) {
      setError('Workout name cannot be empty.');
      return;
    }
    for (const exercise of exercises) {
      if (!exercise.name) {
        setError('Exercise names cannot be empty.');
        return;
      }
    }

    const token = localStorage.getItem('token');
    try {
      await api.post('/api/workouts', {
        name,
        exercises
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setName('');
      setExercises([{ name: '' }]);
    } catch (error) {
      setError('Failed to create workout. Please try again.');
    }
  };

  return (
    <div>
      <h1>Create Workout</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Workout Name"
      />
      {exercises.map((exercise, index) => (
        <div key={index}>
          <input
            type="text"
            value={exercise.name}
            onChange={(e) => handleExerciseChange(index, e.target.value)}
            placeholder="Exercise Name"
          />
        </div>
      ))}
      <button onClick={handleAddExercise}>Add Exercise</button>
      <button onClick={handleCreateWorkout}>Create Workout</button>
    </div>
  );
};

export default CreateWorkout;
