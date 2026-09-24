import type { ButtonHTMLAttributes, HTMLAttributes } from "react";

type Variant = "primary" | "ghost";

const base =
  "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-sm hover:brightness-105 active:brightness-95",
  ghost: "text-gray-400 hover:text-white",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  as?: "button";
  variant?: Variant;
}

interface SpanProps extends HTMLAttributes<HTMLSpanElement> {
  as: "span";
  variant?: Variant;
  disabled?: boolean;
}

type Props = ButtonProps | SpanProps;

/** `as="span"` renders a button-styled span (for wrapping in a <label> that toggles a hidden
 * file input) instead of a real <button>, which would otherwise submit an enclosing <form>. */
export default function Button({ variant = "primary", className = "", ...props }: Props) {
  const classes = `${base} ${variants[variant]} ${props.disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`;

  if (props.as === "span") {
    const { as: _as, disabled, ...rest } = props;
    return (
      <span
        className={`${classes} ${disabled ? "" : "cursor-pointer"}`}
        aria-disabled={disabled}
        {...rest}
      />
    );
  }

  const { as: _as, ...rest } = props as ButtonProps;
  return <button className={`${classes} disabled:cursor-not-allowed disabled:opacity-50`} {...rest} />;
}
