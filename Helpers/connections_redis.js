const redis = require('redis')
const client = redis.createClient({
    port: 6379,
    host: 'localhost',
})

client.ping((err, pong) => {
    console.log(pong)
})
client.on("error", function (error) {
    console.error(error);
});

client.on("connect", function (error) {
    console.log('connected');
});

client.on("ready", function (error) {
    console.log('redis to ready');
});


module.exports = client