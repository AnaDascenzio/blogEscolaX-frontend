import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const Bar = styled.header`
  background: var(--color-white);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 20;
`;

export const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 24px;
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
`;

export const Logo = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--color-primary);
  color: #fff;
  display: grid;
  place-items: center;
  flex-shrink: 0;
`;

export const BrandText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.25;

  strong {
    font-size: 0.95rem;
    color: var(--color-text);
  }

  span {
    font-size: 0.72rem;
    color: var(--color-text-secondary);
  }

  @media (max-width: 560px) {
    display: none;
  }
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
`;

export const NavItem = styled(NavLink)`
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: var(--color-primary-light);
    color: var(--color-primary);
  }

  &.active {
    background: var(--color-primary-light);
    color: var(--color-primary);
  }

  @media (max-width: 560px) {
    padding: 8px 10px;
  }
`;

export const UserArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;

export const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
`;

export const UserText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.25;

  strong {
    font-size: 0.875rem;
    color: var(--color-text);
  }

  span {
    font-size: 0.72rem;
    color: var(--color-text-secondary);
  }

  @media (max-width: 720px) {
    display: none;
  }
`;

export const SignOutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: transparent;
  font-size: 0.875rem;
  color: var(--color-text);
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: var(--color-border);
  }
`;
