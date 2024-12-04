const express = require('express')
const { Register, Login } = require('../Controller/userController')


const Router = express.Router()

Router.post('/register',Register)
Router.post('/login',Login)

module.exports =Router