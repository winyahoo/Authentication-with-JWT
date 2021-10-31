const mongoose = require('mongoose')
const {testConnection} = require('../Helpers/connections_multi_mongodb')
const bcrypt = require('bcrypt');
const schema = mongoose.Schema



const UserSchema = new schema({
    username:{
        type: String,
        lowercase: true,
        require: true,
        unique: true,
    },
    password:{
        type: String,
        require: true
    }
})


//module.exports = mongoose.model('User', UserSchema)
UserSchema.pre('save', async function(next){
    try {
        //console.log(`this is pre save ${this.username} and ${this.password}`)
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(this.password, salt)
        this.password = hash
        next()
    } catch (error) {
        next(error)
    }
})

UserSchema.methods.isCheckPassword = async function(password){
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        next(error)
    }

}
module.exports = testConnection.model('users', UserSchema)
