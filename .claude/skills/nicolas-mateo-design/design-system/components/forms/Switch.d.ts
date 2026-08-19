export interface SwitchProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  /** Accessible name; also rendered beside the track when provided. */
  label?: string;
  description?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Switch(props: SwitchProps): JSX.Element;
