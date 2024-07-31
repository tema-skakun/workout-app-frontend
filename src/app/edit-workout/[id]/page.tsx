"use client";

import { useState, useEffect } from 'react';
import api from '@/api/axios';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

const EditWorkoutPage = () => {
  const [workout, setWorkout] = useState<any>(null);
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
  const router = useRouter();
  const { id } = useParams();

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
        setWorkout(response.data);
        setFormData({
          name: response.data.name,
          exercises: response.data.exercises,
          warmupTime: response.data.warmupTime,
          exerciseTime: response.data.exerciseTime,
          restTime: response.data.restTime,
          rounds: response.data.rounds,
          restBetweenRounds: response.data.restBetweenRounds,
        });
      } catch (err) {
        setError('Failed to fetch workout. Please try again.');
      }
    };

    fetchWorkout();
  }, [id]);

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

  if (!workout) return <p>Loading...</p>;

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
      <button onClick={handleSaveWorkout}>Save Workout</button>
    </div>
  );
};

export default EditWorkoutPage;
