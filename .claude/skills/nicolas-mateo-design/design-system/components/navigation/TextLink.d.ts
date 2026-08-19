export interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
  href?: string;
  /** Adds target=_blank and a trailing arrow-up-right. */
  external?: boolean;
  tone?: "default" | "muted";
  iconBase?: string;
}
export declare function TextLink(props: TextLinkProps): JSX.Element;
