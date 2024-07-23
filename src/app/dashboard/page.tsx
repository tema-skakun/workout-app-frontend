// "use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

const Page = () => {
  const [workouts, setWorkouts] = useState([]);
  const [name, setName] = useState('');
  const [exercises, setExercises] = useState([{ name: '' }]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [warmupTime, setWarmupTime] = useState(0);
  const [exerciseTime, setExerciseTime] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [restBetweenRounds, setRestBetweenRounds] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/workouts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkouts(response.data);
    };

    fetchWorkouts();
  }, []);

  const handleAddExercise = () => {
    setExercises([...exercises, { name: '' }]);
  };

  const handleExerciseChange = (index: number, value: string) => {
    const newExercises = exercises.slice();
    newExercises[index].name = value;
    setExercises(newExercises);
  };

  const handleCreateWorkout = async () => {
    const token = localStorage.getItem('token');
    await axios.post('/api/workouts', {
      name,
      exercises
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const response = await axios.get('/api/workouts', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setWorkouts(response.data);
  };

  const handleSelectWorkout = (workout) => {
    setSelectedWorkout(workout);
  };

  const calculateTotalTime = () => {
    const totalExerciseTime = exercises.length * exerciseTime;
    const totalRestTime = exercises.length * restTime;
    const totalTime = warmupTime + (totalExerciseTime + totalRestTime) * rounds + restBetweenRounds * (rounds - 1);
    setTotalTime(totalTime);
  };

  useEffect(() => {
    calculateTotalTime();
  }, [warmupTime, exerciseTime, restTime, rounds, restBetweenRounds]);

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Create Workout</h2>
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

      <h2>Your Workouts</h2>
      <ul>
        {workouts.map(workout => (
          <li key={workout._id} onClick={() => handleSelectWorkout(workout)}>
            {workout.name}
          </li>
        ))}
      </ul>

      {selectedWorkout && (
        <div>
          <h2>Exercise Workout</h2>
          <label>
            Warmup Time (seconds):
            <input
              type="number"
              value={warmupTime}
              onChange={(e) => setWarmupTime(Number(e.target.value))}
            />
          </label>
          <label>
            Exercise Time (seconds):
            <input
              type="number"
              value={exerciseTime}
              onChange={(e) => setExerciseTime(Number(e.target.value))}
            />
          </label>
          <label>
            Rest Time (seconds):
            <input
              type="number"
              value={restTime}
              onChange={(e) => setRestTime(Number(e.target.value))}
            />
          </label>
          <label>
            Rounds:
            <input
              type="number"
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
            />
          </label>
          <label>
            Rest Between Rounds (seconds):
            <input
              type="number"
              value={restBetweenRounds}
              onChange={(e) => setRestBetweenRounds(Number(e.target.value))}
            />
          </label>
          <h3>Total Time: {totalTime} seconds</h3>
        </div>
      )}
    </div>
  );
};

export default Page;
