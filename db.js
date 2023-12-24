const mysql = require("mysql2/promise");
require("dotenv").config();
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "users",
    password: process.env.SQL_PASSWORD,
});

async function getUsers() {
    const SQL = `
        SELECT * FROM users;
    `;
    const [data] = await pool.query(SQL);
    return data;
}

async function getUser(id) {
    const SQL = `
        SELECT * FROM users
        WHERE users.id = ?;
    `;
    const [[user]] = await pool.query(SQL, [id]);
    return user;
}

async function createUser(user) {
    const SQL = `
    INSERT INTO users(name, age)
    VALUES(?, ?);
`;
    const [{ insertId, affectedRows }] = await pool.query(SQL, [
        user.name,
        user.age,
    ]);
    if (affectedRows) {
        return getUser(insertId);
    }
}

async function deleteUser(id) {
    const user = await getUser(id);
    if (!user) return undefined;
    const SQL = `
    DELETE FROM users
    WHERE users.id = ?
`;
    const [{ affectedRows }] = await pool.query(SQL, [id]);
    if (affectedRows) {
        return user;
    }
}

async function editUser(id, newUser) {
    const SQL = `
    UPDATE users
    SET users.name = ?, users.age = ?
    WHERE users.id = ?
`;
    const [{ affectedRows }] = await pool.query(SQL, [
        newUser.name,
        newUser.age,
        id,
    ]);
    if (affectedRows) {
        return getUser(id);
    }
}

async function test() {
    // console.log(await getUser(2));
    // console.log(await getUser(2));
    // console.log(await createUser({ name: "asher", age: 23 }));
    // console.log(await deleteUser(20));
    // console.log(await editUser(25, { name: "naftali", age: 35 }));
}

// test();

module.exports = {
    getUsers,
    getUser,
    deleteUser,
    createUser,
    editUser,
};
