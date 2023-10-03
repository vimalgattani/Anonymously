import pkg from 'pg';
import 'dotenv/config.js'
const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

const getUserIfExists = (user) => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE name = $1', [user], (error, results) => {
            if (error) {
                reject(error);
            } else {
                const userExists = results.rowCount > 0;
                resolve({
                    exists: userExists,
                    user: userExists ? results.rows[0] : null
                });
            }
        });
    });
};


const query = (text, params, callback) => {
    return pool.query(text, params, callback)
}

export {getUserIfExists, query}