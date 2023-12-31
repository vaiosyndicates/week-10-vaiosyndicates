const authService = require("../../service/auth")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const AuthController = {
  getUser: async (req, res) => {
    try {
      const users = await authService.getAllUsers();
      res.status(200).json({
        responseCode: 200,
        message: "success",
        data: users, 
      });
    } catch (error) {
      res.status(500).json({ 
        responseCode: 500,
        message: "success",
        error: error.message 
      });
    }
  },
  createUser: async (req, res) => {
    try {
      const { name, password, role } = req.body
      const user = await authService.getUserbyName({name: name})
      if(user) {
        res.status(409).json({responseCode: 409, status: 'User already exist'})
      } else {
        const payload = {
          name: name,
          role: role === '0' ? 'user' : role === '1' ? 'approver' : 'admin',
          password: await bcrypt.hash(password, 10)
        }
        const newUser = await authService.createUsers(payload)
        res.json({
          responseCode: 200, 
          status: 'Success',
        })
      }
    } catch (error) {
      res.json({
        responseCode: 505, 
        message: 'Network Error',
        data: error.message
      })
    }
  },
  loginUser: async (req, res) => {
    try {
      const user = await authService.getUserbyName({name: req.body.name})
      if(user) {
        const checkpw = await bcrypt.compare(req.body.password, user.password)
        if(checkpw) {
          const token = jwt.sign({name: user.name, role: user.role}, process.env.SECRET_JWT)
          res.json({
            responseCode: 200,
            message: 'Login success',
            data: {
              token: token
            },
          })
        } else {
          res.json({
            responseCode: 404, 
            status: 'Password not match',
          })
        }
      } else {
        res.json({
          responseCode: 404, 
          status: 'User not found',
        })
      }
    } catch (error) {
      res.json({
        responseCode: 505, 
        message: 'Network Error',
        data: error.message
      })
    }
  }
}

module.exports = AuthController;