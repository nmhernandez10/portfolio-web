export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  /** Strings, or { value, label } objects. */
  options?: Array<string | { value: string; label: string }>;
  iconBase?: string;
}
export declare function Select(props: SelectProps): JSX.Element;
