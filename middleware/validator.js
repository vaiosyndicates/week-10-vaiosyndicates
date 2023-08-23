const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const validate = {
  validateUser: [
    check('name')
    .not()
    .isEmpty()
    .withMessage('Name can not be empty!')
    .bail(),
    check('role')
    .not()
    .isEmpty()
    .withMessage('Role can not be empty!')
    .bail()
    .isIn(['0', '1', '2'])
    .withMessage('Role Undefined')
    .bail(),
    check('password')
    .not()
    .isEmpty()
    .withMessage('Password can not be empty!')
    .bail()
    .isLength({min: 8})
    .withMessage('Minimum 8 characters required!')
    .bail()
    .isAlphanumeric()
    .withMessage('Password only accept Alphanumeric')
    .bail(),
    ( req, res, next ) => {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(422).json({errors: errors.array()});
      next();
   }
  ],
  validateTrx: ( req, res, next ) => {
    const authHeader = req.headers.authorization
    if(!authHeader) {
      return res.status(401).json({
        responseCode: 401,
        message: 'Unauthorized user'
      });
    } else {
      try {
        const token = authHeader.split(' ')[1]
        jwt.verify(token, process.env.SECRET_JWT)
        next()

      } catch (error) {
        return res.status(400).json({
          responseCode: 400,
          message: error.message
        });
      }
    }
  },
  authenticateTrx: ( req, res, next ) => {
    const authHeader = req.headers.authorization
    if(!authHeader) {
      return res.status(401).json({
        responseCode: 401,
        message: 'Unauthorized user'
      });
    } else {
      try {
        const token = authHeader.split(' ')[1]
        const decodeToken = jwt.verify(token, process.env.SECRET_JWT)
        if(decodeToken.role === "approver") {
          next()
        } else {
          return res.status(401).json({
            responseCode: 401,
            message: 'Unauthorized user'
          });
        }

      } catch (error) {
        return res.status(400).json({
          responseCode: 400,
          message: error.message
        });
      }
    }
  },
  authenticateAdmin: ( req, res, next ) => {
    const authHeader = req.headers.authorization
    if(!authHeader) {
      return res.status(401).json({
        responseCode: 401,
        message: 'Unauthorized user'
      });
    } else {
      try {
        const token = authHeader.split(' ')[1]
        const decodeToken = jwt.verify(token, process.env.SECRET_JWT)
        if(decodeToken.role === "admin") {
          next()
        } else {
          return res.status(401).json({
            responseCode: 401,
            message: 'Unauthorized user'
          });
        }

      } catch (error) {
        return res.status(400).json({
          responseCode: 400,
          message: error.message
        });
      }
    }
  },
}

module.exports = validate;