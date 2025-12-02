import React from 'react'
import { UseFormRegister, Path, FieldValues } from 'react-hook-form'

interface InputProps<TFieldValues extends FieldValues>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name'> {
  className?: string
  register?: UseFormRegister<TFieldValues>
  name?: Path<TFieldValues>
  errorMessages?: string
  placeHolder?: string
}

function InnerInput<TFieldValues extends FieldValues>(
  { className = '', register, name, errorMessages, placeHolder, ...props }: InputProps<TFieldValues>,
  ref: React.Ref<HTMLInputElement>
) {
  const inputProps = register && name ? register(name) : {}

  return (
    <div>
      <input
        ref={ref}
        className={[
          'h-10 w-full rounded-xl border border-gray-700 bg-gray-900 px-3 text-sm outline-none transition',
          'placeholder:text-gray-500',
          'focus:border-pink-400 focus:ring-2 focus:ring-pink-200',
          errorMessages ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : '',
          className
        ].join(' ')}
        placeholder={placeHolder}
        {...inputProps}
        {...props}
      />
      {errorMessages && <p className='mt-1 text-xs text-red-400'>{errorMessages}</p>}
    </div>
  )
}

const Input = React.forwardRef(InnerInput) as <TFieldValues extends FieldValues = FieldValues>(
  props: InputProps<TFieldValues> & { ref?: React.Ref<HTMLInputElement> }
) => ReturnType<typeof InnerInput>

export default Input
