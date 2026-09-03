import styled from "styled-components";
import { Link } from "react-router-dom";

// ── Page shell ───────────────────────────────────────────────────────────────

export const Shell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-background);
`;

// ── Nav ──────────────────────────────────────────────────────────────────────

export const Nav = styled.nav`
  background: var(--color-white);
  border-bottom: 1px solid var(--color-border);
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const NavInner = styled.div`
  max-width: 960px;
  margin: 0 auto;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const NavBrand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
`;

export const NavLogo = styled.div`
  width: 36px;
  height: 36px;
  background: var(--color-primary);
  border-radius: 8px;
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 1.1rem;
  flex-shrink: 0;
`;

export const NavBrandText = styled.div`
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
`;

export const NavUser = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const NavAvatar = styled.div`
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

export const NavUserText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  text-align: right;

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

export const BtnSair = styled.button`
  padding: 6px 14px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  font-size: 0.875rem;
  color: var(--color-text);
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: var(--color-border);
  }
`;

// ── Content ──────────────────────────────────────────────────────────────────

export const Content = styled.div`
  flex: 1;
`;
