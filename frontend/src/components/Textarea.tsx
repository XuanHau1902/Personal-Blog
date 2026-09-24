import { forwardRef, type TextareaHTMLAttributes } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, Props>(({ label, id, className = "", ...props }, ref) => {
  const areaId = id ?? props.name;
  return (
    <div className="space-y-1.5">
      <label htmlFor={areaId} className="text-sm font-medium text-gray-300">
        {label}
      </label>
      <textarea
        ref={ref}
        id={areaId}
        className={`w-full resize-y rounded-xl border border-gray-700 bg-gray-900 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-pink-400 focus:ring-2 focus:ring-pink-500/20 ${className}`}
        {...props}
      />
    </div>
  );
});

Textarea.displayName = "Textarea";
export default Textarea;
