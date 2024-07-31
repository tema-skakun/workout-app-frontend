"use client";

import { useState } from 'react';
import api from '@/api/axios';

const CreateWorkoutPage = () => {
  const [name, setName] = useState('');
  const [exercises, setExercises] = useState([{ name: '' }]);
  const [warmupTime, setWarmupTime] = useState(0);
  const [exerciseTime, setExerciseTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [rounds, setRounds] = useState(1);
  const [restBetweenRounds, setRestBetweenRounds] = useState(0);
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
        exercises,
        warmupTime,
        exerciseTime,
        restTime,
        rounds,
        restBetweenRounds
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setName('');
      setExercises([{ name: '' }]);
      setWarmupTime(0);
      setExerciseTime(0);
      setRestTime(0);
      setRounds(1);
      setRestBetweenRounds(0);
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
      <div>
        <label>Warmup Time (seconds):</label>
        <input
          type="number"
          value={warmupTime}
          onChange={(e) => setWarmupTime(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Exercise Time (seconds):</label>
        <input
          type="number"
          value={exerciseTime}
          onChange={(e) => setExerciseTime(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Rest Time (seconds):</label>
        <input
          type="number"
          value={restTime}
          onChange={(e) => setRestTime(Number(e.target.value))}
        />
      </div>
      <div>
        <label>Rounds:</label>
        <input
          type="number"
          value={rounds}
          onChange={(e) => setRounds(Number(e.target.value))}
          min="1"
        />
      </div>
      <div>
        <label>Rest Between Rounds (seconds):</label>
        <input
          type="number"
          value={restBetweenRounds}
          onChange={(e) => setRestBetweenRounds(Number(e.target.value))}
        />
      </div>
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

export default CreateWorkoutPage;
