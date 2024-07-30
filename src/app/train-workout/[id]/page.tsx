"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../lib/axios';
import styles from './page.module.css';

interface Exercise {
  name: string;
}

interface Workout {
  name: string;
  exercises: Exercise[];
  warmupTime: number;
  exerciseTime: number;
  restTime: number;
  rounds: number;
  restBetweenRounds: number;
}

const TrainWorkoutPage = () => {
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [roundIndex, setRoundIndex] = useState(0);
  const [stage, setStage] = useState('warmup');
  const [timeLeft, setTimeLeft] = useState(0);
  const [nextExercise, setNextExercise] = useState('');
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/api/workouts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWorkout(response.data);
      } catch (error) {
        console.error("Failed to fetch workout", error);
      }
    };

    fetchWorkout();
  }, [id]);

  useEffect(() => {
    if (workout) {
      setStage('warmup');
      setTimeLeft(workout.warmupTime * 1000);
      setNextExercise(workout.exercises[0]?.name || '');
    }
  }, [workout]);

  const startTimer = (duration: number) => {
    setTimeLeft(duration);
    const id = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 0) {
          clearInterval(id);
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);
    setIntervalId(id);
  };

  const handleStartPause = () => {
    if (!isActive) {
      handleStart();
    } else if (isPaused) {
      setIsPaused(false);
      startTimer(timeLeft);
    } else {
      clearInterval(intervalId!);
      setIsPaused(true);
    }
  };

  const handleStart = () => {
    if (stage === 'warmup') {
      startTimer(workout?.warmupTime * 1000 || 0);
    } else if (stage === 'exercise') {
      startTimer(workout?.exerciseTime * 1000 || 0);
    } else if (stage === 'rest') {
      startTimer(workout?.restTime * 1000 || 0);
    } else if (stage === 'restBetweenRounds') {
      startTimer(workout?.restBetweenRounds * 1000 || 0);
    }
    setIsActive(true);
  };

  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      if (stage === 'warmup') {
        setStage('exercise');
        setTimeLeft(workout?.exerciseTime * 1000 || 0);
        startTimer(workout?.exerciseTime * 1000 || 0);
      } else if (stage === 'exercise') {
        if (currentExerciseIndex < workout?.exercises.length - 1) {
          setStage('rest');
          setTimeLeft(workout?.restTime * 1000 || 0);
          startTimer(workout?.restTime * 1000 || 0);
          const nextExerciseIndex = currentExerciseIndex + 1;
          const nextExerciseName = workout?.exercises[nextExerciseIndex]?.name || '';
          setNextExercise(nextExerciseName);
        } else if (roundIndex < workout?.rounds - 1) {
          setStage('restBetweenRounds');
          setTimeLeft(workout?.restBetweenRounds * 1000 || 0);
          startTimer(workout?.restBetweenRounds * 1000 || 0);
          const nextExerciseName = workout?.exercises[0]?.name || '';
          setNextExercise(nextExerciseName);
        } else {
          setStage('complete');
          setIsActive(false);
        }
      } else if (stage === 'rest') {
        if (currentExerciseIndex < workout?.exercises.length - 1) {
          setCurrentExerciseIndex(currentExerciseIndex + 1);
          setStage('exercise');
          setTimeLeft(workout?.exerciseTime * 1000 || 0);
          startTimer(workout?.exerciseTime * 1000 || 0);
          const nextExerciseIndex = currentExerciseIndex + 1;
          const nextExerciseName = nextExerciseIndex < workout?.exercises.length ? workout?.exercises[nextExerciseIndex]?.name || '' : '';
          setNextExercise(nextExerciseName);
        } else if (roundIndex < workout?.rounds - 1) {
          setStage('restBetweenRounds');
          setTimeLeft(workout?.restBetweenRounds * 1000 || 0);
          startTimer(workout?.restBetweenRounds * 1000 || 0);
          const nextExerciseName = workout?.exercises[0]?.name || '';
          setNextExercise(nextExerciseName);
        } else {
          setStage('complete');
          setIsActive(false);
        }
      } else if (stage === 'restBetweenRounds') {
        setCurrentExerciseIndex(0);
        setRoundIndex(roundIndex + 1);
        setStage('exercise');
        setTimeLeft(workout?.exerciseTime * 1000 || 0);
        startTimer(workout?.exerciseTime * 1000 || 0);
        const nextExerciseName = workout?.exercises.length > 1 ? workout?.exercises[1]?.name || '' : '';
        setNextExercise(nextExerciseName);
      } else if (stage === 'complete') {
        router.push('/workouts');
      }
    }
  }, [timeLeft, isActive, stage, currentExerciseIndex, roundIndex, workout, router]);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  if (!workout) return <p>Loading...</p>;

  const currentExercise = workout.exercises[currentExerciseIndex];
  const stageLabel = stage === 'warmup' ? 'Разминка' :
    stage === 'exercise' ? (currentExercise ? currentExercise.name : 'Нагрузка') :
      stage === 'rest' ? 'Отдых' :
        stage === 'restBetweenRounds' ? 'Отдых между раундами' :
          'Завершено';

  const buttonText = !isActive ? 'Старт' :
    isPaused ? 'Продолжить' :
      'Пауза';

  return (
    <div className={styles.container}>
      <h1>{workout.name}</h1>
      <button onClick={handleStartPause} className={styles.button}>
        {buttonText}
      </button>
      <div className={styles.timer}>
        <p>{`${Math.floor(timeLeft / 60000)}:${String((timeLeft % 60000) / 1000).padStart(2, '0')}`}</p>
      </div>
      <h2>{stageLabel}</h2>
      { nextExercise && (
        <h3>Далее: {nextExercise}</h3>
      )}
      {/*<div>*/}
      {/*  <h3>Exercises:</h3>*/}
      {/*  <ul>*/}
      {/*    {workout.exercises.map((exercise, index) => (*/}
      {/*      <li key={index}>{exercise.name}</li>*/}
      {/*    ))}*/}
      {/*  </ul>*/}
      {/*</div>*/}
    </div>
  );
};

export default TrainWorkoutPage;
