import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  text?: string;
  placeholder?: string;
  className?: string;
  showLabel?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { text = "", placeholder = "", className = "", showLabel = true, ...props },
    ref
  ) => {
    return (
      <>
        {showLabel && (
          <p className="mb-1 font-medium text-md text-slate-600">{text}</p>
        )}

        <input
          ref={ref} // forwardRef로 ref 전달
          className={`bg-gray-100 py-3 px-4 font-light rounded hover:bg-gray-200 ${className}`}
          placeholder={placeholder}
          {...props}
        />
      </>
    );
  }
);

export default Input;
