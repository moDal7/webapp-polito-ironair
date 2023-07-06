[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/Ij4wZ9xX)
# Exam #2: "Airplane Seats"

## Student: s301199 Marco D'Almo

# Server side

## API Server

- POST `/api/login`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

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

