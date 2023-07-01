'use strict';

const db = require('../database');

const getReservationsByUser = async (id) => {
    const sql = `SELECT * FROM reservations
                 WHERE user_id = ?`;

    return new Promise ((resolve, reject) => {
        db.database.all(sql, [id], (err, rows) => {
            //console.log(rows);
            if(err)
                reject(err);
            else{
                let reservations =  rows;
                resolve(reservations);
            }
        })
    })
}

const addReservation = async (user_id, plane_id, seats) => {
    
    let check = await reservationsCheck(user_id, plane_id, seats);
    if(check)
        const sql = `INSERT INTO reservations(user_id, plane_id)
                    VALUES(?, ?)`;

        return new Promise ((resolve, reject) => {
            db.database.run(sql, [user_id, plane_id, seat], function(err) {
                if(err)
                    reject(err);
                else {
                    sql2 = `UPDATE users SET has_reserved = 1, WHERE id = ?`;
                    db.database.run(sql2, [user_id], function(err) {
                        if(err)
                            reject(err);
                        else{
                            sql3 = `UPDATE planes SET seats = seats - 1 WHERE id = ?`;
                            db.database.run(sql3, [plane_id], function(err) {
                                if(err)
                                    reject(err);
                                else
                                    resolve(this.lastID);
                            });
                        }
                    resolve(this.lastID);
            }
        ));
    })
}   

module.exports = { getReservationsByUser, addReservation, getReservationById, deleteReservation};