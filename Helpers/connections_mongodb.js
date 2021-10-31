const mongoose = require('mongoose')

const conn = mongoose.createConnection('mongodb://localhost:27017/test',{
    useNewUrlParsers: true,
    useUnifiedTopology: false
})

conn.on('error', function(error){
    console.log(error)
})
conn.on('disconnected', function(){    // không dùng arrow function
    console.log(`Mongodb:: disconnected:: ${this.name} `)
})
conn.on('connected', function(){
    console.log(`Mongodb:: connected:: ${this.name} `)
})

process.on('SIGINT', async()=>{
    await conn.close()
    process.exit(0)
})

module.exports = conn