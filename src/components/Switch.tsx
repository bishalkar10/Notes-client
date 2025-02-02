import { memo } from 'react';
import '../styles/Switch.css';

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

const Switch = memo(function Switch({ checked, onChange, disabled }: SwitchProps) {
  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="slider" />
    </label>
  );
});

export default Switch; 