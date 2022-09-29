import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders screen, page loaded", () => {
    render(<App />);
    const linkElement = screen.getByText(/NEXT TO GO - RACING/i);
    expect(linkElement).toBeInTheDocument();
});
