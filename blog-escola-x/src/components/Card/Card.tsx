import type { HTMLAttributes } from "react";

export function Card({ children, ...props }: HTMLAttributes<HTMLElement>) {
  return <section {...props}>{children}</section>;
}