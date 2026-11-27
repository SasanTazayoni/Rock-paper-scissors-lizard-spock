import { render } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import Footer from "./Footer";

describe("Footer", () => {
  test("renders the copyright text", () => {
    const { getByText } = render(<Footer />);
    expect(
      getByText("© Rock Paper Scissors Lizard Spock 2025"),
    ).toBeInTheDocument();
  });

  test("contains a link to the GitHub repository", () => {
    const { getByRole } = render(<Footer />);
    const link = getByRole("link", { name: "Source code on GitHub" });
    expect(link).toHaveAttribute(
      "href",
      "https://github.com/SasanTazayoni/rock-paper-scissors-lizard-spock",
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
