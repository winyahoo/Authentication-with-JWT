const createError = require('http-errors')
const User = require('../models/User.model')
const {userValidate} = require('../Helpers/validation')
const {signAccessToken, signRefreshToken, vertifyAccessToken, vertifyRefreshToken} = require('../Helpers/jwt_service')
const client = require('../Helpers/connections_redis')


module.exports = {
    register: async (req, res, next) => {
        try {
            const {email, password} = req.body;
            const {error} = userValidate(req.body)
            //console.log(error)
            // if(!email || !password){
            //     throw createError.BadRequest()
            // }
            if(error){
                throw createError.BadRequest(error.details[0].message)
            }
            const isExist = await User.findOne({username: email})
            if(isExist){
                throw createError.Conflict(`${email} already exists`)
            }
            const isCreate = await new User({
                username: email,
                password: password
            }).save()
            return res.json({
                status: 'success',
                element: isCreate 
            })
        } catch (error) {
            next(error)
        }
    },
    logIn: async (req, res, next) => {
        try {
            const {email, password} = req.body
            const {error} = userValidate(req.body)
            if(error){
                throw createError.BadRequest(error.details[0].message)
            }
            const user = await User.findOne({email})
            if(!user){
                throw createError.NotFound("User not registered")
            }
            const isValid = user.isCheckPassword(password)
            if(!isValid){
                throw createError.Unauthorized()
            }
    
            const accessToken = await signAccessToken(user._id)
            const refreshToken = await signRefreshToken(user._id)
            return res.json({
                //user,
                accessToken,
                refreshToken
            })
        } catch (error) {
            next(error)
        }
    },
    logOut: async(req, res, next) => {
        try {
            const {refreshToken} = req.body
            if(!refreshToken){
                throw createError.BadRequest()
            }
            const {userId} = await vertifyRefreshToken(refreshToken) //return payload have userId
            client.del(userId.toString(), (err, reply)=>{  //userId is objectId
                if(err){
                    throw createError.InternalServerError()
                }
                res.json({
                    message: 'Logout'
                })
            })
    
        } catch (error) {
            next(error)
        }
    },
    refreshToken: async (req, res, next) => {
        try {
            const {refreshToken} = req.body
            if(!refreshToken){
                throw createError.BadRequest()
            }
            const {userId} = await vertifyRefreshToken(refreshToken) //return payload have userId
            const accessToken = await signAccessToken(userId)
            const newRefreshToken  = await signRefreshToken(userId)
            res.json({
                accessToken,
                refreshToken: newRefreshToken
            })
        } catch (error) {
            next(error)
        }
    },
    lists: (req, res, next) => {
        //console.log(req.payload)
        const listUsers = [
            {
                username: 'abc@gmail.com'
            },
            {
                username: 'def@gmail.com'
            }
        ]
        return res.json({
            listUsers
        })
    }
}