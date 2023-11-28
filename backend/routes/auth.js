const express = require('express')
const User = require('../models/User')
const fetchUser= require('../middleware/fetchUser')
const router = express.Router();
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'Rahul'


//ROUTE 1:create a User using: POST '/api/auth/'. No login require
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, resp) => {
    //if there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return resp.status(400).json({ errors: errors.array() })
    }

    //chack whether the user with this email exist already
    try {


        let user = await User.findOne({ email: req.body.email })

        if (user) {
            return resp.status(400).json({ error: "sorry a user with this email already exists" })
        }
        //password Hashing
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        //create a new User
        user = await User.create({//saves data in db
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        });
        const data = {
            user: {
                id: user.id
            }
        }
        //jwt token
        const authtoken = jwt.sign(data, JWT_SECRET);
        resp.json({ authtoken })

    } catch (error) {
        resp.status(500).send('Internal server Error')
        console.error(error.message)
    }
})

// ROUTE 2: authenticate a User: POST'/api/auth/login'. 
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, resp) => {
    //if there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return resp.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;//fetch email and pass
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return resp.status(400).json({ error: "Please try to login with correct credential" })
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return resp.status(400).json({ error: "Please try to login with correct credential" })
        }

        const data = {//sendint id to auth token
            user: {
                id: user.id
            }
        }
        //jwt token
        const authtoken = jwt.sign(data, JWT_SECRET);
        resp.json({ authtoken })

    } catch (error) {
        resp.status(500).send('Internal Server Error')
        console.error(error.message)
    }
})

// ROUTE 3: Get logggedin User Details using: POST'/api/auth/getuser'.Login required 
router.post('/getuser', fetchUser,async (req, resp) => {

    try {
        userId = req.user.id
        const user = await User.findById(userId).select("-password")
        resp.send(user)


    } catch (error) {
        resp.status(500).send('Internal Server Error')
        console.error(error.message)
    }
})

module.exports = router