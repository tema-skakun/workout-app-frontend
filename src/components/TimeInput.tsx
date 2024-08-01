import React from 'react';

interface TimeInputProps {
  label: string;
  name: string;
  value: number;
  min: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasError: boolean;
}

const TimeInput: React.FC<TimeInputProps> = ({ label, name, value, min, onChange, hasError }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label htmlFor={name}>{label}</label>
      <input
        type="number"
        id={name}
        name={name}
        value={value}
        min={min}
        onChange={onChange}
        style={{ borderColor: hasError ? 'red' : 'initial' }}
      />
      {hasError && <p style={{ color: 'red' }}>Here you can enter a value from {min}.</p>}
    </div>
  );
};

export default TimeInput;
