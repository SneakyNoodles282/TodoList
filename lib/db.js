const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_DB_URI);

let db
 
async function connectdb() {
    try {
        await client.connect();

        db = client.db('todoList')
    } catch(e) {
        await client.close();
        console.log(e)
    }

}

function getDB() {
    return db
}

function getTodos() {
    return db.collection('TodoEntry');
}

function getUsers() {
    return db.collection('Users');
}

module.exports= {
    getDB,
    connectdb,
    getTodos,
    getUsers,
    client
}