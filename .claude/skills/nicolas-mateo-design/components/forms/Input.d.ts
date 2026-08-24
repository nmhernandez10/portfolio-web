import * as React from 'react';

/** Single-line text field with a mono uppercase label. */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Mono uppercase label above the field. */
  label?: string;
  /** Helper text below the field. */
  hint?: string;
  /** Error message; replaces the hint and turns the border rust. */
  error?: string;
}

export declare function Input(props: InputProps): JSX.Element;
