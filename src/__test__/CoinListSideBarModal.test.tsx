import { render, fireEvent, screen } from "@testing-library/react";
import CoinListSideBarModal from "../components/commons/CoinListSideBarModal";

describe("CoinListSideBarModal", () => {
    const setIsOpen = jest.fn();
    it("should render correctly", () => {
        const { container } = render(<CoinListSideBarModal isOpen setIsOpen={setIsOpen} title='Test' action="Confirm"/>);
        expect(container).toMatchSnapshot();
    });
    
    it("should render a modal have title Create test", () => {
        const { container } = render(<CoinListSideBarModal isOpen setIsOpen={() => setIsOpen} title='Create test' action="Confirm"/>);
        // expect(screen.getAllByText("Create test")).toHaveLength(1);
        const cancelButton = screen.getAllByRole("button");
        expect(cancelButton).toHaveLength(2);
    });
});