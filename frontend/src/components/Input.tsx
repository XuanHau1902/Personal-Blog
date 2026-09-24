import { forwardRef, type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = forwardRef<HTMLInputElement, Props>(({ label, id, className = "", ...props }, ref) => {
  const inputId = id ?? props.name;
  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-300">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={`w-full rounded-xl border border-gray-700 bg-gray-900 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20 ${className}`}
        {...props}
      />
    </div>
  );
});

Input.displayName = "Input";
export default Input;
