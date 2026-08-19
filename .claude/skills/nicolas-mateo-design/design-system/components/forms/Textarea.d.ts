export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  /** Default 5. */
  rows?: number;
}
export declare function Textarea(props: TextareaProps): JSX.Element;
