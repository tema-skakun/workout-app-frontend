"use client";

import React, {useEffect} from 'react';
import api from '@/api/axios';
import TimeInput from '@/components/TimeInput';
import ExerciseInputs from '@/components/ExerciseInputs';
import useWorkoutForm from '@/hooks/useWorkoutForm';
import { useRouter, useParams } from 'next/navigation';

const EditWorkoutPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const {
    formData,
    error,
    setError,
    setFormData,
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

  useEffect(() => {
    const fetchWorkout = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not authenticated');
        return;
      }
      try {
        const response = await api.get(`/api/workouts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data;
        setFormData({
          name: data.name,
          exercises: data.exercises,
          warmupTime: data.warmupTime,
          exerciseTime: data.exerciseTime,
          restTime: data.restTime,
          rounds: data.rounds,
          restBetweenRounds: data.restBetweenRounds,
        });
      } catch (err) {
        setError('Failed to fetch workout. Please try again.');
      }
    };

    fetchWorkout();
  }, [id]);

  const handleSaveWorkout = async () => {
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
      await api.put(`/api/workouts/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push('/workouts');
    } catch (error) {
      setError('Failed to update workout. Please try again.');
    }
  };

  if (!formData) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Workout</h1>
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
      <button onClick={handleSaveWorkout}>Save Workout</button>
    </div>
  );
};

export default EditWorkoutPage;
