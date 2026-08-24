import styled from "styled-components";
import { Link } from "react-router-dom";

// ── Page ─────────────────────────────────────────────────────────────────────

export const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-background);
`;

export const PageFooter = styled.footer`
  background: var(--color-white);
  border-top: 1px solid var(--color-border);
  padding: 14px 24px;
  text-align: center;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
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

export const NavBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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

// ── Container / Layout ────────────────────────────────────────────────────────

export const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 24px 48px;
  flex: 1;
`;

export const Breadcrumb = styled(Link)`
  display: inline-block;
  margin-bottom: 16px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 288px;
  gap: 20px;
  align-items: start;
  border: 2px dashed var(--color-primary);
  border-radius: 12px;
  padding: 20px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    padding: 12px;
  }
`;

// ── Form Card ─────────────────────────────────────────────────────────────────

export const FormCard = styled.div`
  background: var(--color-white);
  border-radius: 10px;
  border: 1px solid var(--color-border);
  overflow: hidden;
`;

export const FormHeader = styled.div`
  padding: 28px 28px 20px;
  border-bottom: 1px solid var(--color-border);

  h1 {
    margin: 0 0 6px;
    font-size: 1.5rem;
    color: var(--color-text);
  }

  p {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }
`;

export const FormBody = styled.div`
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// ── Form Fields ───────────────────────────────────────────────────────────────

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

export const Required = styled.span`
  color: var(--color-danger);
`;

export const Optional = styled.span`
  font-weight: 400;
  color: var(--color-text-secondary);
`;

const fieldBase = `
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--color-text);
  background: #fff;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

export const FieldInput = styled.input<{ $hasError?: boolean }>`
  ${fieldBase}
  border: 1px solid ${({ $hasError }) => ($hasError ? "var(--color-danger)" : "var(--color-border)")};
`;

export const FieldSelect = styled.select<{ $hasError?: boolean }>`
  ${fieldBase}
  border: 1px solid ${({ $hasError }) => ($hasError ? "var(--color-danger)" : "var(--color-border)")};
  cursor: pointer;
`;

export const FieldTextarea = styled.textarea<{ $hasError?: boolean }>`
  ${fieldBase}
  border: 1px solid ${({ $hasError }) => ($hasError ? "var(--color-danger)" : "var(--color-border)")};
  resize: none;
`;

export const ErrorMsg = styled.span`
  font-size: 0.75rem;
  color: var(--color-danger);
`;

export const Hint = styled.span`
  font-size: 0.75rem;
  color: var(--color-text-secondary);
`;

// ── Input with icon ───────────────────────────────────────────────────────────

export const InputIconWrap = styled.div`
  position: relative;

  input {
    padding-left: 36px;
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

// ── Dropzone ──────────────────────────────────────────────────────────────────

export const Dropzone = styled.div<{ $isDragOver: boolean }>`
  border: 2px dashed
    ${({ $isDragOver }) =>
      $isDragOver ? "var(--color-primary)" : "var(--color-border)"};
  border-radius: 8px;
  padding: 36px 20px;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--color-text-secondary);
  transition: border-color 0.15s, background 0.15s;
  background: ${({ $isDragOver }) =>
    $isDragOver ? "var(--color-primary-light)" : "transparent"};

  &:hover {
    border-color: var(--color-primary);
    background: var(--color-primary-light);
  }

  p {
    margin: 0;
    font-size: 0.875rem;
  }

  small {
    font-size: 0.75rem;
  }
`;

export const DropzoneLink = styled.span`
  color: var(--color-primary);
  font-weight: 500;
`;

// ── Image preview ─────────────────────────────────────────────────────────────

export const ImagePreview = styled.div`
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--color-border);

  img {
    display: block;
    width: 100%;
    max-height: 200px;
    object-fit: cover;
  }
`;

export const RemoveImage = styled.button`
  display: block;
  width: 100%;
  padding: 8px;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background 0.15s;

  &:hover {
    background: rgba(239, 68, 68, 0.8);
  }
`;

// ── Form footer ───────────────────────────────────────────────────────────────

export const FormFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 28px 20px;
  border-top: 1px solid var(--color-border);

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Disclaimer = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  max-width: 320px;
`;

export const FormBtns = styled.div`
  display: flex;
  gap: 10px;
  flex-shrink: 0;

  @media (max-width: 720px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

export const BtnCancel = styled.button`
  padding: 10px 20px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: transparent;
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: var(--color-border);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const BtnPublish = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.875rem;
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

// ── Sidebar ───────────────────────────────────────────────────────────────────

export const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SidebarCard = styled.div`
  background: var(--color-white);
  border-radius: 10px;
  border: 1px solid var(--color-border);
  padding: 20px;

  h3 {
    margin: 0 0 16px;
    font-size: 0.925rem;
    color: var(--color-text);
  }
`;

// ── Dicas ─────────────────────────────────────────────────────────────────────

export const DicasList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const DicasItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  line-height: 1.5;

  strong {
    color: var(--color-text);
  }
`;

export const DicaDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-primary);
  flex-shrink: 0;
  margin-top: 5px;
`;

// ── Autor Info ────────────────────────────────────────────────────────────────

export const AutorInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AutorRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const AutorLabel = styled.span`
  color: var(--color-text-secondary);
`;

export const AutorValue = styled.span`
  color: var(--color-text);
  font-weight: 500;
`;

export const StatusBadge = styled.span`
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  background: #fef3c7;
  color: #92400e;
`;
