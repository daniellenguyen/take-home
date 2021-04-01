# Record Shelves App

Welcome to the Record Shelves App, a tool for organizing your record collection into different named shelves. There are a number of features implemented already, but still a ways to go before we're ready for public release.

[Live site](https://record-shelves.netlify.app/)

## Current Features Include

- Displays first page of records for user `blacklight`
- Can add/remove shelves for organizing records
- Can rename existing shelves
- Can add records to particular shelves
- Can reorder records within shelves
- Can move records between shelves

## Outstanding Tasks

| Name | Type | Description |
| --- | --- | --- |
| Improve overall styles | Enhancement | Make the template your own, add colors and change layout based on design choices you find preferable. One way to start is by making the app more responsive at different page widths. |
| Add tests | Debt | The test coverage for the app's functionality is lacking, improve coverage on key interactions. |
| Improve overall UX | Enhancement | Identify areas of interaction within the app that are unpleasant and reduce that friction. |

## Bugs/UX improvements:
- On mobile width, stick record list on top and make it horizontal.
- Remove ability to create duplicate shelf names
- Implement duplicate removal for moving in between shelves

## Developing

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
