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
    let list_seats_occupied = []
    for (let i=0; i<list_seats.length; i++){
        let seat = list_seats[i];
        let seat_row = seat.slice(0, -1);
        let seat_column = seat.slice(-1);
        const sql = `SELECT * FROM seats_reserved WHERE plane_id = ? AND row = ? AND column = ?`;
        return new Promise ((resolve, reject) => {
            db.database.all(sql, [plane_id, seat_row, seat_column], (err, rows) => {
                if(err)
                    reject(err);
                else{
                    if(rows.length > 0) {
                    let rows = seat;   
                    list_seats_occupied.push(rows);
                        resolve(false);
                    }
                    else 
                        resolve(true);
                }
            })
        });
    }
    console.log("list_seats_occupied seatCheck");
    console.log(list_seats_occupied);
    return list_seats_occupied;
}

// add a reservation to the database
const addReservation = async (reservation) => {
        
        const user_id = reservation.user_id;
        const plane_id = reservation.plane_id;
        const seats = reservation.seats;
        const sql = `INSERT INTO reservations(user_id, plane_id) VALUES(?, ?)`;
        const check = await seatCheck(seats, plane_id);
        
    if (check.length>0){
        console.error("Seats not available") 
        return check; // erro
r    }
    else{
        return new Promise ((resolve, reject) => {
            db.database.run(sql, [user_id, plane_id], function(err) {
                if(err) {
                    reject(err);
                }
                else {
                    let reservation_id = this.lastID;
                    const sql2 = `UPDATE users SET has_reserved = 1 WHERE id = ?`;
                    db.database.run(sql2, [user_id], function(err) {
                        if(err) {
                            reject(err);
                        }
                        else{
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
            });
        })
    }
}


const deleteReservation = async (reservation_id, user_id) => {
    const sql = `DELETE FROM reservations WHERE id = ?`;

    return new Promise ((resolve, reject) => {
        db.database.run(sql, [reservation_id], function(err) {
            if(err) {
                reject(err);
            }
            else {
                sql2 = `UPDATE users SET has_reserved = 0, WHERE id = ?`;
                db.database.run(sql2, [user_id], function(err) {
                    if(err) {
                        reject(err);
                    }
                    else{
                        sql3 = `UPDATE planes SET seats = seats + 1 WHERE id = ?`;
                        db.database.run(sql3, [plane_id], function(err) {
                            if(err) {
                                reject(err);
                            }
                            else {
                                resolve(this.lastID);
              
                            }
                        });
                    }
                });
            }
        });
    })
}


module.exports = { getReservationById, getReservationByUser, addReservation, deleteReservation};