import { render, fireEvent, screen } from "@testing-library/react";
import Button from "../components/commons/Button";

describe("Button", () => {
  it("should render correctly", () => {
    const { container } = render(<Button />);
    expect(container).toMatchSnapshot();
  });

  it("should render a button have border", () => {
    render(<Button secondary />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("border");
  });

  it("should render a button have text-white bg-red-600", () => {
    render(<Button />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-white bg-red-600");
  });

  it("should render a button have gap-3", () => {
    render(<Button image="https://picsum.photos/200" />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("gap-3");
  });
});
