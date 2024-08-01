import React from 'react';

interface ExerciseInputsProps {
  exercises: { name: string }[];
  autoFocus: boolean;
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
}

const ExerciseInputs: React.FC<ExerciseInputsProps> = ({ exercises, autoFocus, onChange, onAdd }) => {
  return (
    <div>
      {exercises.map((exercise, index) => (
        <div key={index}>
          <input
            type="text"
            value={exercise.name}
            onChange={(e) => onChange(index, e.target.value)}
            placeholder="Exercise Name"
            autoFocus={autoFocus}
          />
        </div>
      ))}
      <button onClick={onAdd}>Add Exercise</button>
    </div>
  );
};

export default ExerciseInputs;
