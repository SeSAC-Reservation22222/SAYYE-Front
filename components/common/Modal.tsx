"use client";

import { ReactNode } from "react";
import Button from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  showCloseButton?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] flex flex-col">
        {title && (
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
        )}
        {children}
        {showCloseButton && (
          <div className="mt-6 flex justify-end">
            <Button onClick={onClose}>확인</Button>
          </div>
        )}
      </div>
    </div>
  );
}


