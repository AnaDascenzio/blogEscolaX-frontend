import type { ButtonHTMLAttributes, ReactNode } from "react";

import "./Button.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
};

export function Button({ children, icon, className, type = "button", ...props }: ButtonProps) {
  const classes = ["shared-button", icon && "shared-button--with-icon", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} type={type} {...props}>
      {icon && <span className="shared-button__icon" aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
}