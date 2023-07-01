DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS planes;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS seats_reserved;

CREATE TABLE users(
    id VARCHAR(7) NOT NULL,
    name VARCHAR(25) NULL,
    surname VARCHAR(25) NULL,
    email VARCHAR(50) NULL,
    password VARCHAR(50) NULL,
    salt VARCHAR(25) NULL,
    has_reserved INTEGER NULL,
    reservation_id INTEGER NULL,
    PRIMARY KEY("id")
);

CREATE TABLE planes(
    id INTEGER NOT NULL,
    plane_name VARCHAR(25) NULL,
    type VARCHAR(25) NULL,
    seats INTEGER NULL,
    num_rows INTEGER NULL,
    num_columns INTEGER NULL,
    reserved_seats INTEGER NULL,
    occupied_seats INTEGER NULL,
    PRIMARY KEY(id)
);

CREATE TABLE reservations(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    user_id VARCHAR(7) NULL,
    plane_id INTEGER NULL
);

CREATE TABLE seats_reserved(
    id INTEGER NOT NULL,
    plane_id INTEGER NULL,
    row INTEGER NULL,
    column VARCHAR(1) NULL,
    reservation_id INTEGER NULL,
    PRIMARY KEY(id)
);

INSERT INTO users(id, name, surname, email, password, salt, has_reserved)
VALUES(000001, 'Giulia', 'Olivieri', 'giulia.olivieri@gmail.com', 'testpw', 'testsalt', 1),
      (000002, 'Luigi', 'Bosso', 'lbosso@gmail.com', 'testpw', 'testsalt', 1),
      (000003, 'Lorenzo', 'Ritorto', 'ritorto.lorenzo@gmail.com', 'testpw', 'testsalt', 0),
      (000004, 'Daniela', 'Berardino', 'daniela.berardino@gmail.com', 'testpw', 'testsalt', 0);

INSERT INTO planes(id, plane_name, type, seats, num_rows, num_columns, reserved_seats, occupied_seats)
VALUES(1, 'ATR72', 'Local', 60, 15, 4, 0, 0),
      (2, 'A220-100', 'Regional', 100, 20, 5, 0, 0),
      (3, 'Boeing 737-7', 'International', 150, 25, 6, 0, 0);

INSERT INTO reservations(id, user_id, plane_id)
VALUES(1, 000001, 1),
      (2, 000001, 2),
      (3, 000002, 2),
      (4, 000002, 3);

INSERT INTO seats_reserved(id, plane_id, row, column, reservation_id)
VALUES(1, 1, 3, 'B', 1),
      (2, 2, 2, 'A', 2),
      (3, 2, 1, 'C', 3),
      (4, 3, 2, 'A', 4);
