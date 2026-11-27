import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// jsdom doesn't implement <dialog> showModal()/close(). These stand-ins mirror
// the parts of browser behaviour the app relies on: the `open` attribute,
// focusing the first focusable element, and the `close` event.
if (typeof HTMLDialogElement.prototype.showModal !== "function") {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    if (this.hasAttribute("open")) {
      throw new DOMException("Dialog is already open", "InvalidStateError");
    }
    this.setAttribute("open", "");
    this.querySelector<HTMLElement>(
      "button, [href], input, select, textarea, [tabindex]",
    )?.focus();
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
}

afterEach(() => {
  cleanup();
  localStorage.clear();
});
