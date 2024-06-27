import { render, fireEvent, screen } from "@testing-library/react";
import ActionsListModal from "../components/commons/ActionsListModal";

describe("ActionsListModal", () => {
    const setIsOpen = jest.fn();
    it("should render correctly", () => {
        const { container } = render(<ActionsListModal isOpen setIsOpen={setIsOpen} title='Test'/>);
        expect(container).toMatchSnapshot();
    });
    
    it("should render a modal have title Create test", () => {
        const { container } = render(<ActionsListModal isOpen setIsOpen={() => setIsOpen} title='Create test'/>);
        // expect(screen.getAllByText("Create test")).toHaveLength(1);
        const cancelButton = screen.getAllByRole("button");
        expect(cancelButton).toHaveLength(2);
    });
});

