const JWT = require('jsonwebtoken');
const createError = require('http-errors')
const client = require('../Helpers/connections_redis')
const signAccessToken = async(userId) =>{
    return new Promise((resolve, reject) =>{
        const payload = {
            userId
        }
        const secret = process.env.ACCESS_TOKEN_SECRET 
        const options = {
            expiresIn: '1m'
        }
        JWT.sign(payload, secret, options, (err, token) =>{
            if(err) return reject(err)
            return resolve(token)
        })
    })
}

const signRefreshToken = async(userId) =>{
    return new Promise((resolve, reject) =>{
        const payload = {
            userId
        }
        const secret = process.env.REFRESH_TOKEN_SECRET 
        const options = {
            expiresIn: '1y'
        }
        JWT.sign(payload, secret, options, (err, token) =>{
            if(err) return reject(err)
            client.set(userId.toString(), token, 'EX', 365*24*60*60, (err, reply)=>{ //userId is objectId
                if(err){
                    return reject(createError.InternalServerError())
                }
                resolve(token)
            })
            return resolve(token)
        })
    })
}

const vertifyAccessToken = async (req, res, next) =>{
    if(!req.headers['authorization']) return next(createError.Unauthorized())
    const accessToken = req.headers['authorization'].split(" ")[1]
    //start vertify
    JWT.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, payload)=>{
        if(err){
            if(err.name === 'JsonWebTokenError'){
                return next(createError.Unauthorized(err.message))
            }
            return next(createError.Unauthorized(err.message))
        }

        req.payload = payload
        next()
    })
}

const vertifyRefreshToken = async (refreshToken) =>{
    return new Promise((resolve, reject) =>{
        JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload)=>{
            if(err){
                return reject(err)
            } 
            client.get(payload.userId, (err, reply)=>{
                if(err){
                    return reject(createError.InternalServerError())
                }
                if(refreshToken === reply){
                    return resolve(payload)
                }
                return reject(createError.Unauthorized())
            })
            
        })
    })
}




module.exports = {
    signAccessToken,
    signRefreshToken,
    vertifyAccessToken,
    vertifyRefreshToken
}
