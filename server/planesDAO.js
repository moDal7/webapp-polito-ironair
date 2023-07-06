'use strict';

const db = require('./database');

const getAllPlanes = async () => {
    const sql = `SELECT * FROM planes`
    
    return new Promise ((resolve, reject) => {
        db.database.all(sql, [], (err, rows) => {
            if(err)
                reject(err);
            else{
                let planes = [];
                planes = rows;
                resolve(planes);
            }
        })
    })
}


const getPlanesById = async (id) => {
    const sql = `SELECT * FROM planes WHERE id = ?`;

    return new Promise ((resolve, reject) => {
        db.database.get(sql, [id], (err, row) => {
            if(err)
                reject(err);
            else{
                let plane = row;
                resolve(plane);
            }
        })
    })
}

const getOccupiedSeats = async (plane_id) => {
    const sql = `SELECT * FROM seats_reserved WHERE plane_id = ?`;
    return new Promise ((resolve, reject) => {
        db.database.all(sql, [plane_id], (err, rows) => {
            if(err)
                reject(err);
            else{
                let seats =  rows;
                resolve(seats);
            }
        })
    })
}

module.exports = { getAllPlanes, getPlanesById, getOccupiedSeats};