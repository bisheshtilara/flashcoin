import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { render, fireEvent, screen } from "@testing-library/react";
import TextInput from "../components/commons/TextInput";

describe("TextInput", () => {
    it("should render correctly", () => {
        const { container } = render(<TextInput label="test"/>);
        expect(container).toMatchSnapshot();
    });
    
    it("should render a input have icon", () => {
        const { container } = render(<TextInput label="test" icon={<MagnifyingGlassIcon className="h-6 text-red-600" />} />);
        expect(container).toMatchSnapshot();
    });
});