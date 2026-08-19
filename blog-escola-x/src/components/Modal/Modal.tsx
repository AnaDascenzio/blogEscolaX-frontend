import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <h2 id="modal-title">{title}</h2>
      {children}
      <button type="button" onClick={onClose}>Fechar</button>
    </div>
  );
}