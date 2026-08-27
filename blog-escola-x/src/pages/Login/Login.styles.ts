import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: var(--color-background);
  padding: 24px;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 400px;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 36px 32px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
`;

export const Brand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
  text-align: center;
`;

export const Logo = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--color-primary);
  color: #fff;
  display: grid;
  place-items: center;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 1.25rem;
  color: var(--color-text);
`;

export const Subtitle = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--color-text);
  }
`;

export const InputWrap = styled.div`
  position: relative;

  input {
    width: 100%;
    padding: 10px 14px 10px 38px;
    border-radius: 8px;
    border: 1px solid var(--color-border);
    font-size: 0.875rem;
    color: var(--color-text);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;

    &:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    &::placeholder {
      color: #94a3b8;
    }
  }
`;

export const InputIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
  pointer-events: none;
  display: flex;
  align-items: center;
`;

export const ToggleVisibility = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
`;

export const ErrorMsg = styled.span`
  font-size: 0.75rem;
  color: var(--color-danger);
`;

export const SubmitBtn = styled.button`
  margin-top: 4px;
  padding: 11px 20px;
  border: none;
  border-radius: 8px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: var(--color-primary-dark);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Footer = styled.p`
  margin: 20px 0 0;
  text-align: center;
  font-size: 0.78rem;
  color: var(--color-text-secondary);
`;
