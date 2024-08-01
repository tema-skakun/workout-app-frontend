"use client";

import React, { useState } from 'react';
import api from '@/api/axios';
import TimeInput from '@/components/TimeInput';
import ExerciseInputs from '@/components/ExerciseInputs';
import useWorkoutForm from '@/hooks/useWorkoutForm';
import { useRouter } from 'next/navigation';

const CreateWorkoutPage = () => {
  const router = useRouter();
  const {
    formData,
    error,
    setError,
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

  const [formErrors, setFormErrors] = useState({
    warmupTime: false,
    exerciseTime: false,
    restTime: false,
    restBetweenRounds: false,
    rounds: false
  });

  const validateForm = () => {
    const errors = {
      warmupTime: formData.warmupTime < 5,
      exerciseTime: formData.exerciseTime < 5,
      restTime: formData.restTime < 5,
      restBetweenRounds: formData.restBetweenRounds < 5,
      rounds: formData.rounds < 1
    };
    setFormErrors(errors);
    return !Object.values(errors).includes(true);
  };

  const handleCreateWorkout = async () => {
    if (!validateForm()) {
      setError('Please correct the errors in the form.');
      return;
    }

    setError('');

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
      router.push('/workouts?success=true');
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
        hasError={formErrors.warmupTime}
      />
      <TimeInput
        label="Exercise Time"
        name="exerciseTime"
        value={formData.exerciseTime}
        min={5}
        onChange={handleChange}
        hasError={formErrors.exerciseTime}
      />
      <TimeInput
        label="Rest Time"
        name="restTime"
        value={formData.restTime}
        min={5}
        onChange={handleChange}
        hasError={formErrors.restTime}
      />
      <TimeInput
        label="Rounds"
        name="rounds"
        value={formData.rounds}
        min={1}
        onChange={handleChange}
        hasError={formErrors.rounds}
      />
      <TimeInput
        label="Rest Between Rounds"
        name="restBetweenRounds"
        value={formData.restBetweenRounds}
        min={5}
        onChange={handleChange}
        hasError={formErrors.restBetweenRounds}
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
