import * as React from 'react';

/** Multi-line field, matching Input's label and focus treatment. */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  /** @default 5 */
  rows?: number;
}

export declare function Textarea(props: TextareaProps): JSX.Element;
