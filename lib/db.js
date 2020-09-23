const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_DB_URI);

let db
async function connectdb() {
    try {
        await client.connect();

        const database = client.db('todoList');
        db = database.collection('TodoEntry');
        

    } catch(e) {
        await client.close();
        console.log(e)
    }

}

function getDB() {
    return db
}


module.exports= {
    getDB,
    connectdb,
}