"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../lib/axios';
import styles from './page.module.css';

const TrainWorkoutPage = () => {
  const [workout, setWorkout] = useState<any>(null);
  const [isActive, setIsActive] = useState(false);
  const [stage, setStage] = useState('warmup');
  const [timeLeft, setTimeLeft] = useState(0);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchWorkout = async () => {
      const token = localStorage.getItem('token');
      const response = await api.get(`/api/workouts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkout(response.data);
    };

    fetchWorkout();
  }, [id]);

  const stages = {
    warmup: { duration: 3000, label: 'Разминка' },
    exercise: { duration: 6000, label: 'Нагрузка' },
    rest: { duration: 2000, label: 'Отдых' },
  };

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

  const handleStart = () => {
    setIsActive(true);
    startTimer(stages[stage].duration);
  };

  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      switch (stage) {
        case 'warmup':
          setStage('exercise');
          startTimer(stages.exercise.duration);
          break;
        case 'exercise':
          setStage('rest');
          startTimer(stages.rest.duration);
          break;
        case 'rest':
          setStage('complete');
          setIsActive(false);
          break;
        case 'complete':
          router.push('/workouts');
          break;
      }
    }
  }, [timeLeft, isActive, stage, router]);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  if (!workout) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h1>{workout.name}</h1>
      <h2>{stages[stage].label}</h2>
      <div className={styles.timer}>
        <p>{`${Math.floor(timeLeft / 60000)}:${(timeLeft % 60000) / 1000}`}</p>
      </div>
      <button onClick={handleStart} disabled={isActive} className={styles.button}>
        Начать тренировку
      </button>
    </div>
  );
};

export default TrainWorkoutPage;
