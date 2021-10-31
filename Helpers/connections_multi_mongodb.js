const mongoose = require('mongoose')


function newConnection(uri) {
    const conn = mongoose.createConnection(uri,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    conn.on('error', function(error) {
        console.log(`Mongodb:: connection ${this.name} ${JSON.stringify(error)}`)
    })
    conn.on('disconnected', function () {    // không dùng arrow function
        console.log(`Mongodb:: disconnected:: ${this.name} `)
    })
    conn.on('connected', function () {
        console.log(`Mongodb:: connected:: ${this.name} `)
    })

    return conn

}   

//make connection to DB test
const testConnection = newConnection(process.env.URI_MONGODB_TEST)
//const userConnection = newConnection(process.env.URI_MONGODB_USERS)

module.exports = {
    testConnection
    //userConnection
}