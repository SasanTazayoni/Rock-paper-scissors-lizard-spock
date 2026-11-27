import { fireEvent, render } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import Modal from "./Modal";

const renderModal = (onClose = vi.fn()) => {
  const utils = render(
    <Modal
      className="test-modal"
      titleId="test-title"
      testId="test-modal"
      onClose={onClose}
    >
      <h2 id="test-title">Test title</h2>
      <button>OK</button>
    </Modal>,
  );
  return { ...utils, onClose, dialog: utils.getByTestId("test-modal") };
};

describe("Modal", () => {
  test("opens with showModal and is labelled by its title", () => {
    const showModal = vi.spyOn(HTMLDialogElement.prototype, "showModal");
    const { getByRole, dialog } = renderModal();

    expect(showModal).toHaveBeenCalledTimes(1);
    expect(dialog).toHaveAttribute("open");
    expect(getByRole("dialog", { name: "Test title" })).toBe(dialog);
  });

  test("moves focus inside when opened", () => {
    const { getByRole } = renderModal();
    expect(getByRole("button", { name: "OK" })).toHaveFocus();
  });

  test("returns focus to the previously focused element when unmounted", () => {
    const opener = document.createElement("button");
    document.body.appendChild(opener);
    opener.focus();

    const { unmount, dialog } = renderModal();
    expect(opener).not.toHaveFocus();

    unmount();
    expect(dialog).not.toHaveAttribute("open");
    expect(opener).toHaveFocus();
    opener.remove();
  });

  test("Escape calls onClose and stops the browser closing it directly", () => {
    const { dialog, onClose } = renderModal();
    const cancel = new Event("cancel", { cancelable: true });

    fireEvent(dialog, cancel);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(cancel.defaultPrevented).toBe(true);
  });

  test("a click on the backdrop calls onClose", () => {
    const { dialog, onClose } = renderModal();
    vi.spyOn(dialog, "getBoundingClientRect").mockReturnValue(
      new DOMRect(100, 100, 300, 200),
    );

    fireEvent.click(dialog, { clientX: 50, clientY: 50 });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("a click inside the dialog box does not close it", () => {
    const { dialog, onClose, getByRole } = renderModal();
    vi.spyOn(dialog, "getBoundingClientRect").mockReturnValue(
      new DOMRect(100, 100, 300, 200),
    );

    fireEvent.click(dialog, { clientX: 150, clientY: 150 }); // on the padding
    fireEvent.click(getByRole("heading"), { clientX: 0, clientY: 0 });

    expect(onClose).not.toHaveBeenCalled();
  });
});
