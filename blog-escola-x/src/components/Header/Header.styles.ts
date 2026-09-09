import styled from "styled-components";

export const HeaderBar = styled.header`
  width: 100%;
  max-width: 1152px;
  min-height: 96px;
  margin: 24px auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(15, 23, 42, 0.06);

  @media (max-width: 640px) {
    min-height: 80px;
    margin: 16px 0;
    padding: 12px 16px;
    gap: 12px;
    flex-direction: column;
    align-items: stretch;
  }
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

export const BrandIcon = styled.div`
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: var(--color-primary);
  background: #eaf2ff;
  border-radius: 50%;
`;

export const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.25;

  strong {
    color: var(--color-text);
    font-size: 0.95rem;
  }

  span {
    color: var(--color-text-secondary);
    font-size: 0.72rem;
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  min-width: 0;

  @media (max-width: 640px) {
    justify-content: space-between;
  }
`;

export const NewPostButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  background-color: #2563eb;
  color: #ffffff;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(37, 99, 235, 0.2);
  transition: all 0.15s ease-in-out;

  &:hover {
    background-color: #1d4ed8;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 640px) {
    padding: 8px 14px;
    font-size: 0.8125rem;
    border-radius: 8px;
    gap: 6px;
  }
`;

export const User = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const UserText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  text-align: right;

  strong {
    color: var(--color-text);
    font-size: 0.875rem;
    white-space: nowrap;
  }

  span {
    color: var(--color-text-secondary);
    font-size: 0.72rem;
  }

  @media (max-width: 520px) {
    display: none;
  }
`;

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: transparent;
  color: var(--color-text);
  font-size: 0.875rem;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #f8fafc;
  }

  @media (max-width: 640px) {
    padding: 8px;

    span {
      display: none;
    }
  }
`;
