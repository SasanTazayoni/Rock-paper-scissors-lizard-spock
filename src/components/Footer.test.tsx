import { render } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import Footer from "./Footer";

describe("Footer", () => {
  test("shows the current year in the copyright text", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2031-06-15"));

    const { getByText } = render(<Footer />);
    expect(
      getByText(/rock paper scissors lizard spock game 2031/i),
    ).toBeInTheDocument();

    vi.useRealTimers();
  });

  test("contains a link to the GitHub repository", () => {
    const { getByRole } = render(<Footer />);
    const link = getByRole("link", { name: "Source code on GitHub" });
    expect(link).toHaveAttribute(
      "href",
      "https://github.com/SasanTazayoni/Rock-paper-scissors-lizard-spock",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  test("renders the GitHub icon inline, hidden from screen readers", () => {
    const { getByRole } = render(<Footer />);
    const icon = getByRole("link").querySelector("svg");
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });
});
