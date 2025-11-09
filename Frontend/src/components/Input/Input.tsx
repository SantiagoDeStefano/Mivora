import React from "react";
import { UseFormRegister, Path } from "react-hook-form";

interface InputProps<T = Record<string, unknown>> extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
  className?: string;
  register?: UseFormRegister<T>;
  name?: Path<T>;
  errorMessages?: string;
  placeHolder?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({
  className = "",
  register,
  name,
  errorMessages,
  placeHolder,
  ...props
}: InputProps, ref) {
  const inputProps = register && name ? register(name) : {};

  return (
    <div>
      <input
        ref={ref}
        className={[
          "h-10 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-200 dark:bg-gray-900 dark:border-gray-700",
          errorMessages ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "",
          className
        ].join(" ")}
        placeholder={placeHolder}
        {...inputProps}
        {...props}
      />
      {errorMessages && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errorMessages}</p>
      )}
    </div>
  );
});

export default Input;