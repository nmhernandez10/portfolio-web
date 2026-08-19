export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Mono uppercase caption above the field. */
  label?: string;
  hint?: string;
  /** Replaces hint and turns the border clay. */
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}
export declare function Input(props: InputProps): JSX.Element;
