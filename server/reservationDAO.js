'use strict';

const db = require('./database');

// get specific reservation from the database
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

// get specific reservation from the database
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
const seatCheck = async (seats, plane_id) => {
    for (seat in seats){
        seat_row = seat[0];
        seat_column = seat[1];
        const sql = `SELECT * FROM seats_reserved WHERE plane_id = ? AND row = ? AND column = ?`;
        return new Promise ((resolve, reject) => {
            db.database.all(sql, [plane_id, seat_row, seat_column], (err, rows) => {
                if(err)
                    reject(err);
                else{
                    if(rows.length > 0)
                        return false;
                    else
                        resolve(true);
                }
            })
        })
    }
    return true;
}

// add a reservation to the database
const addReservation = async (user_id, plane_id, seats) => {

        const sql = `INSERT INTO reservations(user_id, plane_id)
                    VALUES(?, ?)`;
    if (await seatCheck(seats, plane_id)){
        resolve(false);
    }
    else{
        return new Promise ((resolve, reject) => {
            db.database.run(sql, [user_id, plane_id, seat], function(err) {
                if(err) {
                    reject(err);
                }
                else {
                    sql2 = `UPDATE users SET has_reserved = 1, WHERE id = ?`;
                    db.database.run(sql2, [user_id], function(err) {
                        if(err) {
                            reject(err);
                        }
                        else{
                            let seats_num = seats.length;
                            sql3 = `UPDATE planes SET occupied_seats = seats - ? WHERE id = ?`;
                            db.database.run(sql3, [seats_num, plane_id], function(err) {
                                if(err) {
                                    reject(err);
                                }
                                else{
                                    sql4 = `INSERT INTO seats_reserved(plane_id, row, column) VALUES(?, ?, ?)`;
                                    db.database.run(sql4, [plane_id, seat_row, seat_column], function(err) {
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