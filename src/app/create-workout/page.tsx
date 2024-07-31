"use client";

import { useState } from 'react';
import api from '@/api/axios';

const CreateWorkoutPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    exercises: [{ name: '' }],
    warmupTime: 0,
    exerciseTime: 0,
    restTime: 0,
    rounds: 1,
    restBetweenRounds: 0,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rounds' || name.includes('Time') ? Number(value) : value,
    }));
  };

  const handleExerciseChange = (index: number, value: string) => {
    const newExercises = formData.exercises.slice();
    newExercises[index].name = value;
    setFormData(prev => ({
      ...prev,
      exercises: newExercises,
    }));
  };

  const handleAddExercise = () => {
    setFormData(prev => ({
      ...prev,
      exercises: [...prev.exercises, { name: '' }],
    }));
  };

  const handleCreateWorkout = async () => {
    setError('');
    setSuccess(false);
    if (!formData.name) {
      setError('Workout name cannot be empty.');
      return;
    }
    for (const exercise of formData.exercises) {
      if (!exercise.name) {
        setError('Exercise names cannot be empty.');
        return;
      }
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You are not authenticated');
      return;
    }
    try {
      await api.post('/api/workouts', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess(true);
      setFormData({
        name: '',
        exercises: [{ name: '' }],
        warmupTime: 0,
        exerciseTime: 0,
        restTime: 0,
        rounds: 1,
        restBetweenRounds: 0,
      });
    } catch (error) {
      setError('Failed to create workout. Please try again.');
    }
  };

  return (
    <div>
      <h1>Create Workout</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>Workout created successfully!</p>}
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Workout Name"
      />
      <div>
        <label>Warmup Time (seconds):</label>
        <input
          type="number"
          name="warmupTime"
          value={formData.warmupTime}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Exercise Time (seconds):</label>
        <input
          type="number"
          name="exerciseTime"
          value={formData.exerciseTime}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Rest Time (seconds):</label>
        <input
          type="number"
          name="restTime"
          value={formData.restTime}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Rounds:</label>
        <input
          type="number"
          name="rounds"
          value={formData.rounds}
          onChange={handleChange}
          min="1"
        />
      </div>
      <div>
        <label>Rest Between Rounds (seconds):</label>
        <input
          type="number"
          name="restBetweenRounds"
          value={formData.restBetweenRounds}
          onChange={handleChange}
        />
      </div>
      {formData.exercises.map((exercise, index) => (
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
