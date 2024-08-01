import React from 'react';

interface TimeInputProps {
  label: string;
  name: string;
  value: number;
  min: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TimeInput: React.FC<TimeInputProps> = ({ label, name, value, min, onChange }) => {
  return (
    <div>
      <label>{label} (seconds):</label>
      <input
        type="number"
        name={name}
        value={value}
        min={min}
        onChange={onChange}
      />
    </div>
  );
};

export default TimeInput;
