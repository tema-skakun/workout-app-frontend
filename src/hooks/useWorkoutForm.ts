import { useState } from 'react';

const useWorkoutForm = (initialFormData: any) => {
  const [formData, setFormData] = useState(initialFormData);
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

  return {
    formData,
    error,
    success,
    setError,
    setSuccess,
    setFormData,
    handleChange,
    handleExerciseChange,
    handleAddExercise,
  };
};

export default useWorkoutForm;
