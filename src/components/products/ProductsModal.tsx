import type { ReactNode } from "react";

interface ProductModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function ProductModal({
  title,
  onClose,
  children,
}: ProductModalProps) {
  return (
    <div
      className="product-modal-overlay"
      onClick={onClose}
    >
      <div
        className="product-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="product-modal-header">
          <h2>{title}</h2>

          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}