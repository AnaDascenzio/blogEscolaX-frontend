import styled from "styled-components";

export const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--color-background);
`;

export const Card = styled.div`
  width: 100%;
  max-width: 380px;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 32px 28px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
`;

export const Brand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 28px;
  text-align: center;
`;

export const BrandLogo = styled.div`
  width: 44px;
  height: 44px;
  background: var(--color-primary);
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 1.3rem;
`;

export const BrandText = styled.div`
  h1 {
    margin: 0;
    font-size: 1.15rem;
    color: var(--color-text);
  }

  p {
    margin: 4px 0 0;
    font-size: 0.8rem;
    color: var(--color-text-secondary);
  }
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
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text);
  }
`;

export const FieldInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--color-text);
  background: #fff;
  outline: none;
  border: 1px solid ${({ $hasError }) => ($hasError ? "var(--color-danger)" : "var(--color-border)")};
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

export const ErrorMsg = styled.span`
  font-size: 0.75rem;
  color: var(--color-danger);
`;

export const BtnSubmit = styled.button`
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
