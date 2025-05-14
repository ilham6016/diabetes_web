const db = require('../config/db');

async function findUserByGoogleId(googleId) {
    const [rows] = await db.execute('SELECT * FROM users WHERE google_id = ?', [googleId]);
    return rows[0];
}

async function findUserByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
}

async function createUserWithGoogle(googleId, name, email, picture) {
    const [result] = await db.execute(
        'INSERT INTO users (google_id, name, email, picture, approved) VALUES (?, ?, ?, ?, ?)',
        [googleId, name, email, picture, 0]
    );
    const [newUser] = await db.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
    return newUser[0];
}

module.exports = {
    findUserByGoogleId,
    findUserByEmail,
    createUserWithGoogle,
};