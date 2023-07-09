# Exam #2: "Airplane Seats"

## Student: s301199 Marco D'Almo

# Server side

## API Server

- POST `/api/login`
  - The API call has no parameters. In the request body there are the user credentials in JSON.
  - In case of successful authentication the return status code is 201, and the response body has the user informations (id, name, surname...) in JSON format. Otherwise the return status code is 401, and the message says "Incorrect username or password".
- GET `/api/sessions/current`
  - The API call has no request parameters.
  - The response code is 200 (OK), and the response body is the user information in JSON format as before. In case of failure it returns 401 (Unauthorized).
- DELETE `/api/sessions/current`
  - he API call has no request parameters.
  - It logs out the user by deleting the current session. It returns 200 (OK) in any case.
- GET `/api/planes/`
  - The API call has no request parameters.
  - The response code is 200 (OK), and the response body is a list of JSON objects each containing all the information relative to each plane (id, name, brief description, number of rows, number of columns...).
- GET `/api/planes/:id`
  - The API call has the id parameter, which is used to determine which plane information give as response.
  - The response code is 200 (OK), and the response body is a JSON object with all the info of the corresponding plane. If the parameter is not an Integer or is higher or lower than fixed thresholds the response code is 422 (Unprocessable Entity).
## Database Tables

- Table `users` - contains user_id, credentials, has_reserved, reservation_id
- Table `planes` - contains plane_id, num_seats, reserved_seats, occupied_seats
- Table `reservations` - contains reservation_id, user_id, plane_id
- Table `seats` - contains plane_id, seat_id, unic_seat_id


# Client side

## React Client Application Routes

- Route `/`: Home page, with all the plane cards and basic plane info.
- Route `/planes/:planeId`: Specific plane page, with 2D seat visualization and possibility to add or delete a reservation.
- Route `/login`: Login page, where the user can input credentials to get identified and authorized.

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

# Usage info

## Example Screenshot

![Screenshot](./images/screenshot.jpg)

## Users Credentials

- lbosso@gmail.com, password: ironairtest 
- giulia.olivieri@gmail.com, password: ironairtest 
- daniela.berardino@gmail.com, password: ironairtest

