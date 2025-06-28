import { memo, ChangeEvent, MouseEvent } from "react";
import "../styles/Switch.css";

interface SwitchProps {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClick?: (e: MouseEvent<HTMLLabelElement>) => void;
  disabled?: boolean;
}

const Switch = memo(function Switch({
  checked,
  onChange,
  onClick,
  disabled,
}: SwitchProps) {
  return (
    <label className="switch" onClick={onClick}>
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
