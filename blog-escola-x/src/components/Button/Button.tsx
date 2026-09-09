import type { ButtonHTMLAttributes, ReactNode } from "react";
import styled from "styled-components";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 24px;
  border: 0;
  border-radius: 10px;
  background: var(--color-primary);
  color: var(--color-white);
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 160ms ease, transform 160ms ease, box-shadow 160ms ease;

  &:hover:not(:disabled) { background: var(--color-primary-dark); }
  &:active:not(:disabled) { transform: translateY(1px); }
  &:focus-visible {
    outline: 3px solid color-mix(in srgb, var(--color-primary) 35%, transparent);
    outline-offset: 3px;
  }
  &:disabled { cursor: not-allowed; opacity: 0.6; }
`;

const ButtonIcon = styled.span`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  & > svg { width: 18px; height: 18px; stroke-width: 2.5; }
`;

export function Button({ children, icon, type = "button", ...props }: ButtonProps) {
  return (
    <StyledButton type={type} {...props}>
      {icon && <ButtonIcon aria-hidden="true">{icon}</ButtonIcon>}
      {children}
    </StyledButton>
  );
}