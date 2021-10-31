const express = require('express');
const route = express.Router()

const UserController = require('../Controllers/User.controller')
const {vertifyAccessToken} = require('../Helpers/jwt_service')


route.post('/register', UserController.register)

route.post('/login',  UserController.logIn)

route.delete('/logout', UserController.logOut)

route.post('/refresh-token', UserController.refreshToken)


route.get('/lists', vertifyAccessToken, UserController.lists)


module.exports = route