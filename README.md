## About The Project

This is a single page web application which displays the 'Next to go' races using Neds data.

The requirements that have been implemented are:

-   Pull data from Neds API
-   Display next 5 races in ascending order based on the scheduled jump time
-   Display the meeting_name, race_number and the time remaining
-   Remove the race after the time since the scheduled jump exceeds 60 seconds
-   Ability for users to filter the races based on harness, greyhound & thoroughbred

## Getting Started

Follow these steps:

```sh
    git clone https://github.com/codielittle/NedsNextToGo.git

    cd NedsNextToGo

    npm install

```

## Usage

To run the web app, run `npm start`. This will start a development server.

Open `localhost:3000` in your browser.

### Built With

This web app has been built with React 18.2.0.

`create-react-app` with the `--template typescript` flag was used to initialise this application.

The styling has loosely been based on the [Neds](https://www.neds.com.au) website.

One of the shades of the iconic Neds orange `#fd7106` has been used as the background.

The SVG icons representing harness, greyhound and thoroughbred racing have been pulled from [Neds](https://www.neds.com.au). These are used in as the category filters, as well as being displayed on the race cards.

The logic for displaying the time till the scheduled jump time is the same as Neds:

-   Grey and only displaying minutes remaining for >= 5m remaining
-   Orange and displaying minutes and seconds remaining for <= 4m remaining
-   Red and only displaying seconds remaining for < 1m remaining
-   (Darker) Red and only displaying seconds since the scheduled jump time as a negative

## API

The data used in this web app is requested from the Neds API.

To following API endpoint is used to request the next 50 races, regardless of the cataegory:

`https://api.neds.com.au/rest/v1/racing/?method=nextraces&count=50`

Another option that was explored was using the same API that the [Neds racing](https://www.neds.com.au/racing) page uses - `https://api.neds.com.au/v2/racing/next-races-category-group?count=15`. This data is received in a much easier format to work with given that it will always contain the next `count` races for each category in the request.

This wasn't viable due to this being the 'v2' API and it has CORS constraints.

It was noticed that on the [Neds](https://www.neds.com.au) racing page, an API request is sent every 30 seoncds to `https://api.neds.com.au/v2/racing/next-races-category-group?count=15` to get the next 15 races for each category.

To reduce the number of API calls that this dashboard makes, a fetch call is made to refresh the race data when the number of races in the current list is < 30.

## Testing

Unit tests have been implemented using `Jest` and `testing-library/react`. The test files are located in `src/components/__tests__/`.

To run the tests, use `npm test`

Testing could be expanded with the use of the `enzyme` testing libaray, however it currently doesn't support React 18.0.

## Next Steps

There is other race data that is returned by the API than could be displayed on the dashboard. Information such as the race distance, weather and track condition are all important features to display to give users an overview of upcoming races.

Similarly to the Neds and Ladbrokes apps, a filter could be added for Domestic/International races.

Race market data can be retrieved from the API endpoint:
`https://api.neds.com.au/rest/v1/racing/?method=racecard&id={RACE_ID}` RACE_ID = race_id from the original API call.
This response data contains the price fluctuations for each runner.
Therefore it would be possible to display the 'market mover' for each race on this 'Next to go' dashboard.
The market mover represents the runner whose odds have decreased the most (as a percentage) from their opening price.
