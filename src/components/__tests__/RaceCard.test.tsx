import ReactDom from "react-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ReactDOM from "react-dom/client";
import { act } from "react-dom/test-utils";
import App from "../../App";
import { NextRaces } from "../NextRaces";
import RaceCard from "../RaceCard";

it("can render RaceCard", () => {
    render(<RaceCard />);
});

test("RaceCard rendered correctly with props", () => {
    const props = {
        name: "React Testing Library",
        race_number: "10",
    };

    render(<RaceCard {...props} />);

    const fullString = screen.getByTestId("race-card-container");
    expect(fullString.textContent).toBe(props.name + " R" + props.race_number);
});

test("RaceCard rendered with jump_time 0f now", () => {
    let nowTime = Math.floor(new Date().valueOf() / 1000);
    const props = {
        name: "React Testing Library",
        race_number: "10",
        jump_time: nowTime,
    };
    render(<RaceCard {...props} />);

    const timeString = screen.getByTestId("race-card-time").textContent;

    expect(timeString).toContain("0s");
});

//Test that the time is being displayed correctly based on how long is remaining/has passed
test("RaceCard rendered with correct styling for time remaining - grey", () => {
    let nowTime = Math.floor(new Date().valueOf() / 1000);

    const props = {
        name: "React Testing Library",
        race_number: "10",
        jump_time: nowTime + 605,
    };
    render(<RaceCard {...props} />);

    const timeStringClass = screen
        .getByTestId("race-card-time")
        .getAttribute("class");

    expect(timeStringClass).toBe("time-string-text-grey");
    expect(screen.getByTestId("race-card-time").textContent).toBe("10m");
});

test("RaceCard rendered with correct styling for time remaining - orange", () => {
    const nowTime = Math.floor(new Date().valueOf() / 1000);
    const props = {
        name: "React Testing Library",
        race_number: "10",
        jump_time: nowTime + 120,
    };
    render(<RaceCard {...props} />);

    const timeStringClass = screen
        .getByTestId("race-card-time")
        .getAttribute("class");

    expect(timeStringClass).toBe("time-string-text-orange");

    expect(screen.getByTestId("race-card-time").textContent).toBe("1m 59s");
});

test("RaceCard rendered with correct styling for time remaining - expired", () => {
    const nowTime = Math.floor(new Date().valueOf() / 1000);
    const props = {
        name: "React Testing Library",
        race_number: "10",
        jump_time: nowTime - 30,
    };
    render(<RaceCard {...props} />);

    const timeStringClass = screen
        .getByTestId("race-card-time")
        .getAttribute("class");

    expect(timeStringClass).toBe("time-string-text-expired");

    expect(screen.getByTestId("race-card-time").textContent).toBe("-30s");
});

test("RaceCard rendered with correct styling for time remaining - red", () => {
    const nowTime = Math.floor(new Date().valueOf() / 1000);
    const props = {
        name: "React Testing Library",
        race_number: "10",
        jump_time: nowTime + 30,
    };
    render(<RaceCard {...props} />);

    const timeStringClass = screen
        .getByTestId("race-card-time")
        .getAttribute("class");

    expect(timeStringClass).toBe("time-string-text-red");

    expect(screen.getByTestId("race-card-time").textContent).toBe("29s");
});
