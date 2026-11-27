import { useEffect, useRef } from "react";
import type { MouseEvent, ReactNode, SyntheticEvent } from "react";

type ModalProps = {
  className: string;
  titleId: string;
  testId: string;
  onClose: () => void;
  children: ReactNode;
};

// A native modal <dialog>. showModal() puts it in the top layer, makes the rest
// of the page inert, moves focus inside and draws the ::backdrop overlay.
// The modal is shown while mounted; the parent closes it by unmounting it.
export default function Modal({
  className,
  titleId,
  testId,
  onClose,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previouslyFocused = document.activeElement;
    dialog.showModal();

    return () => {
      dialog.close();
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, []);

  // Escape: let React state close the modal instead of the browser.
  const handleCancel = (e: SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    onClose();
  };

  // A click whose target is the dialog itself but lands outside its box was on
  // the backdrop. Clicks on the dialog's own padding stay inside the box.
  const handleClick = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target !== e.currentTarget) return;
    const box = e.currentTarget.getBoundingClientRect();
    const inside =
      e.clientX >= box.left &&
      e.clientX <= box.right &&
      e.clientY >= box.top &&
      e.clientY <= box.bottom;
    if (!inside) onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className={className}
      data-testid={testId}
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClick={handleClick}
    >
      {children}
    </dialog>
  );
}
