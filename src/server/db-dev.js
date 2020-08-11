const MongoClient = require('mongodb').MongoClient;

// Connection url

const url = 'mongodb://192.168.0.101:27017';

// Database Name

const DEFAULT_DB = 'socialight';

// Connect using MongoClientS

/*MongoClient.connect(url, function (err, client) {

    // Select the database by name

    const testDb = client.db(dbName);

    console.log("Database connected.");

    client.close();

});*/

export function connect(dbName) {
    return new Promise((res),(rej) => {
        MongoClient.connect(url, function(err, client) {
            if(!dbName) {
                dbName = DEFAULT_DB;
            }
            const db = client.db(dbName);
            if(!err) {
                res(db);
            } else {
                console.log(err);
                rej(err);
            }
        });
    });
}