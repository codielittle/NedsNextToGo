import React, { useEffect, useState } from "react";

import { Harness } from "./svg/harness";
import { Thoroughbred } from "./svg/thoroughbred";
import { Greyhound } from "./svg/greyhound";

// Returns the appropriate SVG based on the race.category_id
export const SVGType = (props: any) => {
    if (props.category_id === "9daef0d7-bf3c-4f50-921d-8e818c60fe61") {
        return <Greyhound svgClass="svg-icon" />;
    } else if (props.category_id === "4a2788f8-e825-4d36-9894-efd4baf1cfae") {
        return <Thoroughbred svgClass="svg-icon" />;
    } else {
        return <Harness svgClass="svg-icon" />;
    }
};

const RaceCard = (props: any) => {
    const [timeString, setTimeString] = useState<string>();
    const [timeStringClass, setTimeStringClass] = useState<string>();

    useEffect(() => {
        // Tick every second, update time
        const intervalId = setInterval(() => {
            updateRemainingTime(props);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [props]);

    // When component mounts, calculate time remaining
    useEffect(() => {
        updateRemainingTime(props);
    }, []);

    function updateRemainingTime(props: any) {
        let nowTime = new Date().valueOf() / 1000;

        // If the difference between the current time and the race jump time exceeds -60 seconds, delete race.
        if (props.jump_time - nowTime <= -60) {
            // Calls the removeExpiredRaceFunction of the parent component (NextRaces)
            props.removeExpiredRaceFunction(props.race_id);
        }

        // Calculate difference between the jump_time and now (seconds)
        const difference = props.jump_time - nowTime;

        if (difference >= 0) {
            var minutes = Math.floor(difference / 60);
            var seconds = difference - minutes * 60;

            // Uses the same logic/styling as Neds.com.au
            // If < 60 seconds
            if (minutes === 0) {
                setTimeString(Math.floor(seconds).toString() + "s");
                setTimeStringClass("time-string-text-red");
            }
            // If > 5 minutes remainng, set to grey
            else if (minutes >= 5) {
                setTimeString(minutes.toString() + "m");
                setTimeStringClass("time-string-text-grey");
            }
            // Else; time remaining < 5 minutes
            else {
                setTimeString(
                    minutes.toString() +
                        "m " +
                        Math.floor(seconds).toString() +
                        "s"
                );
                setTimeStringClass("time-string-text-orange");
            }
        } else {
            // Handle negative value. Will always only be seconds, minutes aren't required.

            // Calculates the difference between the jump time and now. Will be a negative amount >= -59
            let delta = Math.abs(difference);

            // Set the timeString and timeStringClass values
            setTimeString("-" + Math.floor(delta).toString() + "s");
            setTimeStringClass("time-string-text-expired");
        }
    }

    return (
        <div className="race-card-container">
            <SVGType category_id={props.category_id} />
            <p data-testid="race-card-time" className={timeStringClass}>
                {timeString}
            </p>
            <p className="meeting-text" data-testid="race-card-container">
                {props.name} R{props.race_number}
            </p>
        </div>
    );
};

export default RaceCard;
