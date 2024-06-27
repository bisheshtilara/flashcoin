import { render, fireEvent, screen } from "@testing-library/react";
import ModalContainer from "../components/commons/ModalContainer";

describe("ModalContainer", () => {
  const setIsOpen = jest.fn();
  it("should render correctly", () => {
    const { container } = render(
      <ModalContainer
        isOpen
        setIsOpen={setIsOpen}
        title="Test"
        action="Confirm"
        children={<span>Hello</span>}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("should render a modal have title Create test", () => {
    const { container } = render(
      <ModalContainer
        isOpen
        setIsOpen={() => setIsOpen}
        title="Create test"
        action="Confirm"
        children={<span>Hello</span>}
      />
    );
    // expect(screen.getAllByText("Create test")).toHaveLength(1);
    const cancelButton = screen.getAllByRole("button");
    expect(cancelButton).toHaveLength(2);
  });
});
