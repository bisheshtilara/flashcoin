import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import ActionButton from "../components/commons/ActionButton";

describe("ActionButton", () => {
  it("should render correctly", () => {
    const { container } = render(<ActionButton />);
    expect(container).toMatchSnapshot();
  });

  it("should have text remove", () => {
    const { container } = render(<ActionButton remove />);
    expect(container.textContent).toBe("Remove");
  });

  it("should have text details", () => {
    const { container } = render(<ActionButton details />);
    expect(container.textContent).toBe("Details");
  });

  it("should appern alert when click on button", () => {
    const mockFn = jest.fn();
    const { container } = render(
      <ActionButton remove action={mockFn} />
    );
    fireEvent.click(screen.getByText("Remove"));
    expect(mockFn).toBeCalled();
  });
});
