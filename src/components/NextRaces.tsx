import React, { useState, useEffect } from "react";
import RaceCard from "./RaceCard";
// Import SVG icons for category filters
import { Harness } from "./svg/harness";
import { Greyhound } from "./svg/greyhound";
import { Thoroughbred } from "./svg/thoroughbred";

import { Race } from "./types/Race";

export const NextRaces = () => {
    // Initialise boolean to store whether thoroughbred races are to be displayed
    const [thoroughbredToggled, setThoroughbredToggled] =
        useState<boolean>(true);
    // Initialise boolean to store whether greyhound races are to be displayed
    const [greyhoundToggled, setGreyhoundToggled] = useState<boolean>(true);
    // Initialise boolean to store whether harness races are to be displayed
    const [harnessToggled, setHarnessToggled] = useState<boolean>(true);

    // Initialise state to store the class to display the thoroughbred filter
    const [thoroughbredClass, setThoroughbredClass] = useState<string>(
        "racing-toggle-selected"
    );
    // Initialise state to store the class to display the greyhound filter
    const [greyhoundClass, setGreyhoundClass] = useState<string>(
        "racing-toggle-selected"
    );
    // Initialise state to store the class to display the harness filter
    const [harnessClass, setHarnessClass] = useState<string>(
        "racing-toggle-selected"
    );

    // Init nextRacesData to be an empty array
    // Used to store the array of races that are displayed. Will have 5 race objects.
    const [nextRacesData, setNextRacesData] = useState<any[]>([]);

    // Need to add a second varialbe that stores the original API response. Used when turning filters on and when replacing expired races
    const [apiResponseData, setApiResponseData] = useState<any[]>([]);

    // Category ID's
    const HarnessCategoryID = "161d9be2-e909-4326-8c2c-35ed71fb460b";
    const GreyhoundCategoryID = "9daef0d7-bf3c-4f50-921d-8e818c60fe61";
    const ThoroughbredCategoryID = "4a2788f8-e825-4d36-9894-efd4baf1cfae";

    // Filter to only return races matching the categories toggled on
    function filterArray(item: any) {
        // If toggled and race category_id matches
        if (
            (greyhoundToggled && item.category_id === GreyhoundCategoryID) ||
            (thoroughbredToggled &&
                item.category_id === ThoroughbredCategoryID) ||
            (harnessToggled && item.category_id === HarnessCategoryID)
        ) {
            return true;
        }
        return false;
    }

    // Removes expired races from the nextRacesData and apiResponseData lists using the race ID
    const removeExpiredRace = (raceId: string) => {
        //Remove race from apiResponseData using filter()
        let fullList = apiResponseData.filter(
            (item) => item.race_id !== raceId
        );

        let filteredArray = fullList.filter(filterArray);

        // If a sufficient amount of races remain in the array
        if (fullList.length > 32) {
            var sliced = filteredArray.slice(0, 5);
            setNextRacesData(sliced);
            setApiResponseData(fullList);
        } else {
            // Need to refresh the list of races

            fetchRaces(40).then((data) => {
                let raceList = data as Array<Race>;

                // Remove race from this new array also
                raceList = raceList.filter((item) => item.race_id !== raceId);
                //console.log("raceList - ", raceList);

                setApiResponseData(raceList);
                let filteredArray = raceList.filter(filterArray);
                var sliced = filteredArray.slice(0, 5);
                setNextRacesData(sliced);
            });
        }
    };

    // Handles toggling the thoroughbred filter.
    const handleThoroughbredToggle = () => {
        // Toggle thoroughbredClass to be the appropriate class value
        if (thoroughbredClass === "racing-toggle") {
            setThoroughbredClass("racing-toggle-selected");
        } else {
            setThoroughbredClass("racing-toggle");
        }
        // Flip thoroughbredToggled
        setThoroughbredToggled(!thoroughbredToggled);
    };

    // Handles toggling the greyhound filter.
    const handleGreyhoundToggle = () => {
        // Toggle greyhoundClass to be the appropriate class value
        if (greyhoundClass === "racing-toggle") {
            setGreyhoundClass("racing-toggle-selected");
        } else {
            setGreyhoundClass("racing-toggle");
        }
        // Flip greyhoundToggled
        setGreyhoundToggled(!greyhoundToggled);
    };

    // Handles toggling the harness filter.
    const handleHarnessToggle = () => {
        // Toggle harnessClass to be the appropriate class value
        if (harnessClass === "racing-toggle") {
            setHarnessClass("racing-toggle-selected");
        } else {
            setHarnessClass("racing-toggle");
        }
        // Flip harnessToggled
        setHarnessToggled(!harnessToggled);
    };

    // Watches [greyhoundToggled, thoroughbredToggled, harnessToggled] and is triggered whenever these state variables are changed
    useEffect(() => {
        // Set nextRacesData to be empty
        setNextRacesData([]);
        // If any of the filters are turned off, filter results.
        if (!greyhoundToggled || !thoroughbredToggled || !harnessToggled) {
            // Filter based on the results of the API call, rather than the current array
            let filteredArray = apiResponseData.filter(filterArray);

            // If array contains more than 5 races
            if (filteredArray.length > 5) {
                var sliced = filteredArray.slice(0, 5);
                setNextRacesData(sliced);
            } else {
                // < 5 results, display the whole list
                setNextRacesData(filteredArray);
            }
        } else {
            // Else all filters on, return next 5 races from original data
            var sliced = apiResponseData.slice(0, 5);
            setNextRacesData(sliced);
        }
    }, [greyhoundToggled, thoroughbredToggled, harnessToggled]);

    async function fetchRaces(numRaces: number) {
        // numRaces determines how many races are to be returned
        try {
            const url = `https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=${numRaces.toString()}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Error! status:  ${response.status}`);
            }

            const result = await response.json();

            const raceData = Object.values(result.data.race_summaries);

            // Sort the list based on ascending advertised start times
            const sortedList = raceData.sort((a: any, b: any) =>
                a.advertised_start.seconds < b.advertised_start.seconds ? -1 : 1
            );

            // Return sorted list
            return sortedList;
        } catch (error) {
            if (error instanceof Error) {
                console.log("error message: ", error.message);
                return error.message;
            } else {
                console.log("unexpected error: ", error);
                return "An unexpected error occurred";
            }
        }
    }

    // When component mounts, fetch races
    useEffect(() => {
        fetchRaces(40).then((data) => {
            const raceList = data as Array<Race>;
            setApiResponseData(raceList);

            // If more than 5 races are returned
            if (raceList.length > 5) {
                let sliced = raceList.slice(0, 5) as Array<Race>;
                setNextRacesData(sliced);
            } else {
                // < 5 results, display the whole list
                setNextRacesData(raceList);
            }
        });
    }, []);

    return (
        <div className="container">
            <div className="racing-bar">
                <p className="racing-text">Next To Go - Racing</p>
                <div className="racing-toggle-container">
                    <div
                        data-testid="thoroughbred-toggle-div"
                        onClick={() => handleThoroughbredToggle()}
                    >
                        <Thoroughbred svgClass={thoroughbredClass} />
                    </div>

                    <div onClick={() => handleGreyhoundToggle()}>
                        <Greyhound svgClass={greyhoundClass} />
                    </div>
                    <div onClick={() => handleHarnessToggle()}>
                        <Harness svgClass={harnessClass} />
                    </div>
                </div>
            </div>
            {nextRacesData.map((item, idx) => (
                <RaceCard
                    name={item.meeting_name}
                    race_number={item.race_number}
                    jump_time={item.advertised_start.seconds}
                    key={idx}
                    removeExpiredRaceFunction={removeExpiredRace}
                    race_id={item.race_id}
                    category_id={item.category_id}
                />
            ))}
        </div>
    );
};
