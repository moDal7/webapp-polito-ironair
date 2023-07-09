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
    PRIMARY KEY("id")
);

CREATE TABLE planes(
    id INTEGER NOT NULL,
    plane_name VARCHAR(25) NULL,
    type VARCHAR(25) NULL,
    description VARCHAR(100) NULL,
    seats INTEGER NULL,
    num_rows INTEGER NULL,
    num_columns INTEGER NULL,
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

INSERT INTO users(id, name, surname, email, password, salt)
VALUES(000001, 'Giulia', 'Olivieri', 'giulia.olivieri@gmail.com', '75bdb0db0ed0b9c9e9531538dd56176ac7e0682468a8435f1584ccdd62f22e85', 'a1s2d3f4'),
      (000002, 'Luigi', 'Bosso', 'lbosso@gmail.com', '809247d3640ffa666726c4f28744aa14ceb566c644c725b73001735243315f8d', '2s3d4f5g'),
      (000003, 'Lorenzo', 'Ritorto', 'ritorto.lorenzo@gmail.com', 'd3d4d9612c54137f39a95a399826d624d59208957eefdcb855fc610ec9c1b565', '3d4f5g6h'),
      (000004, 'Daniela', 'Berardino', 'daniela.berardino@gmail.com', '616567eb269368d7f0c82e12de072540e201bce8b0e00b2d1cd5be9f30b96638', '4f5g6h7j');

INSERT INTO planes(id, plane_name, type, description, seats, num_rows, num_columns, occupied_seats)
VALUES(0, 'ATR72', 'Local', 'Our local and smallest option, with up to 60 passengers.', 60, 15, 4, 4),
      (1, 'A220-100', 'Regional', 'With up to 100 passengers, our regional option is more comfortable for longer flights.', 100, 20, 5, 2),
      (2, 'Boeing 737-7', 'International', 'Our biggest aircraft, for our longest flight.', 150, 25, 6, 3);

INSERT INTO reservations(id, user_id, plane_id)
VALUES(1, 000001, 0),
      (2, 000001, 1),
      (3, 000002, 1),
      (4, 000002, 2),
      (5, 000002, 0);

INSERT INTO seats_reserved(id, plane_id, row, column, reservation_id)
VALUES(1, 0, 3, 'B', 1),
      (2, 0, 3, 'A', 1),
      (3, 1, 2, 'A', 2),
      (4, 1, 1, 'C', 3),
      (5, 2, 2, 'A', 4),
      (6, 0, 12, 'A', 5),
      (7, 0, 12, 'B', 5);
      
