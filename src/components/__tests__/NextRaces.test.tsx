import ReactDom from "react-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ReactDOM from "react-dom/client";
import { act } from "react-dom/test-utils";
import App from "../../App";
import { NextRaces } from "../NextRaces";

// Tests that the main component renders
it("renders NextRaces", () => {
    render(<NextRaces />);
});
