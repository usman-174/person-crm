import Home from "../src/app/page";
import { render, screen } from "@testing-library/react";

// Returns a div element with an empty class and the text "dwadawd".
it('should check that the text in the div element is not blank', () => {
	render(<Home />);
	const divElement = screen.getByText("dwadawd");
	expect(divElement).toBeInTheDocument();
	expect(divElement.textContent).not.toBe('');
});