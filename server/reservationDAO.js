'use strict';

const db = require('./database');

// GET specific reservation from the database
const getReservationById = async (id) => {
    const sql = `SELECT * FROM reservations WHERE id = ?`;

    return new Promise ((resolve, reject) => {
        db.database.all(sql, [id], (err, rows) => {
            if(err)
                reject(err);
            else{
                let reservations =  rows;
                resolve(reservations);
            }
        })
    })
}

// GET specific reservation from the database by user id
const getReservationByUser = async (id) => {
    const sql = `SELECT * FROM reservations WHERE user_id = ?`;

    return new Promise ((resolve, reject) => {
        db.database.all(sql, [id], (err, rows) => {
            if(err)
                reject(err);
            else{
                let reservations =  rows;
                resolve(reservations);
            }
        })
    })
}

// check if seats are available at the time of the query run, in case of concurrent requests
// ausiliary function for addReservation
const seatCheck = async (seats, plane_id) => {
    let list_seats = seats.replace(/\s+/g, '').split(",");
    const sql = `SELECT * FROM seats_reserved WHERE plane_id = ?`;
    return new Promise ((resolve, reject) => {
        db.database.all(sql, [plane_id], (err, rows) => {
            if(err)
                reject(err);
            else {
                let seats = rows; 
                let seats_transformed = [];
                seats.forEach((seat) => {
                    seats_transformed.push(seat.row + seat.column);
                });
                let seats_occuppied = list_seats.filter((seat) => { return seats_transformed.includes(seat)});
                resolve(seats_occuppied);
            }
        })
    });
}


// add a reservation to the database
const addReservation = async (reservation) => {
        
        const user_id = reservation.user_id;
        const plane_id = reservation.plane_id;
        const seats = reservation.seats;
        const sql = `INSERT INTO reservations(user_id, plane_id) VALUES(?, ?)`;
         
        return new Promise ((resolve, reject) => {
            db.database.run(sql, [user_id, plane_id], function(err) {
                if(err) {
                    reject(err);
                }
                else {
                    let reservation_id = this.lastID;
                        let list_seats = seats.replace(/\s+/g, '').split(",");
                        let seats_num = list_seats.length;
                        const sql3 = `UPDATE planes SET occupied_seats = occupied_seats + ? WHERE id = ?`;
                        db.database.run(sql3, [seats_num, plane_id], function(err) {
                            if(err) {
                                reject(err);
                            }
                            else{
                                for (let i=0; i<list_seats.length; i++){
                                    let seat = list_seats[i];
                                    let seat_row = seat.slice(0, -1);
                                    let seat_column = seat.slice(-1);
                                    const sql4 = `INSERT INTO seats_reserved(plane_id, row, column, reservation_id) VALUES(?, ?, ?, ?)`;
                                    db.database.run(sql4, [plane_id, seat_row, seat_column, reservation_id], function(err) {
                                        if(err) {
                                            reject(err);
                                        }   
                                        else {
                                            resolve(this.lastID);
                                        }
                                    })
                                };
                            }
                        });
                    }
                });
            }
        )
    }

const numSeats = async (reservation_id) => {
    const sql = `SELECT COUNT (*) FROM seats_reserved WHERE reservation_id = ?`;
    return new Promise ((resolve, reject) => {
        db.database.get(sql, [reservation_id], (err, rows) => {
            if(err)
                reject(err);
            else{
                let num_seats = rows;
                resolve(num_seats);
            }
        })
    })
}

const numOccupiedSeats = async (plane_id) => { 
    const sql = `SELECT occupied_seats FROM planes WHERE id = ?`;
    return new Promise ((resolve, reject) => {
        db.database.get(sql, [plane_id], (err, rows) => {
            if(err)
                reject(err);
            else{
                let num_seats = rows;
                resolve(num_seats);
            }
        })
    })
}

const deleteReservation = async (reservation_id) => {
    const reservation = await getReservationById(reservation_id);
    const plane_id = reservation[0].plane_id;
    const num_seats = await numSeats(reservation_id).then((result) => {return result['COUNT (*)']});
    const num_occupied_seats = await numOccupiedSeats(plane_id).then((result) => {return result.occupied_seats});
    const new_num_occupied_seats = num_occupied_seats - num_seats;

    const sql = `DELETE FROM reservations WHERE id = ?`;
    return new Promise ((resolve, reject) => {
        db.database.run(sql, [reservation_id], function(err) {
            if(err) {
                reject(err);
            }
            else {
                const sql2 = `DELETE FROM seats_reserved WHERE reservation_id = ?`;
                db.database.run(sql2, [reservation_id], function(err) {
                    if(err) {
                        reject(err);
                    }
                    else{
                        const sql3 = `UPDATE planes SET occupied_seats = ? WHERE id = ?`;
                        db.database.run(sql3, [new_num_occupied_seats, plane_id], function(err) {
                            if(err) {
                                reject(err);
                            }
                            else {
                                resolve(200);
                            }
                        });
                    }
                });
            }
        });
    })
}


module.exports = { getReservationById, getReservationByUser, addReservation, deleteReservation, seatCheck};