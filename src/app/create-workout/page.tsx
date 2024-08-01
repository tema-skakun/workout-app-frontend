"use client";

import React from 'react';
import api from '@/api/axios';
import TimeInput from '@/components/TimeInput';
import ExerciseInputs from '@/components/ExerciseInputs';
import useWorkoutForm from '@/hooks/useWorkoutForm';

const CreateWorkoutPage = () => {
  const {
    formData,
    error,
    success,
    setError,
    setSuccess,
    handleChange,
    handleExerciseChange,
    handleAddExercise,
  } = useWorkoutForm({
    name: '',
    exercises: [{ name: '' }],
    warmupTime: 5,
    exerciseTime: 5,
    restTime: 5,
    rounds: 1,
    restBetweenRounds: 5,
  });

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
        autoFocus={true}
      />
      <TimeInput
        label="Warmup Time"
        name="warmupTime"
        value={formData.warmupTime}
        min={5}
        onChange={handleChange}
      />
      <TimeInput
        label="Exercise Time"
        name="exerciseTime"
        value={formData.exerciseTime}
        min={5}
        onChange={handleChange}
      />
      <TimeInput
        label="Rest Time"
        name="restTime"
        value={formData.restTime}
        min={5}
        onChange={handleChange}
      />
      <TimeInput
        label="Rounds"
        name="rounds"
        value={formData.rounds}
        min={1}
        onChange={handleChange}
      />
      <TimeInput
        label="Rest Between Rounds"
        name="restBetweenRounds"
        value={formData.restBetweenRounds}
        min={5}
        onChange={handleChange}
      />
      <ExerciseInputs
        exercises={formData.exercises}
        onChange={handleExerciseChange}
        onAdd={handleAddExercise}
        autoFocus={true}
      />
      <button onClick={handleCreateWorkout}>Create Workout</button>
    </div>
  );
};

export default CreateWorkoutPage;
