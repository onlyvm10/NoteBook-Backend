const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const JWT_secret = '2ce2zw0ab5';
const fetchuser = require('../middleware/fetchuser');





//defines an endpoint
//Route1 - > creating a user using =>POST "/api/auth/createuser". No login required
router.post('/createUser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }), //validator checks
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {


    //if there are errors send bad request, and errors
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
        return res.status(400).json({ success,errors: errors.array() });
    }
    let user = await User.findOne({ name: req.body.email });
    if (user) {
        return res.status(400).json({success, errors: "Sorry this email is already in use" })
    }
    const salt = await bcrypt.genSalt(10);
    secPass = await bcrypt.hash(req.body.password, salt);
    try {
        //wait till the user is created
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })
        
        //then generate and send its authToken
        const data = {
            user: {
                id: user.id
            }
        }
        const authData = jwt.sign(data, JWT_secret);
        success = true;
        res.json({success, AuthToken: authData });

    }
    //in error use catch block
    catch (err) {
        res.json({ success, error: 'Please enter a unique email', message: err.message });
    };

})


//Route-2 -> authenticating a user using => POST "/api/auth/login" NO login required.
router.post('/login', [
    //validator checks
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password cannot be empty').exists(),
], async (req, res) => {


    //if there are errors send bad request, and errors
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
        return res.send(success).status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({success,error:"Enter Correct Credentials"});
        }
        const passCompare = await bcrypt.compare(password, user.password);
        if (passCompare == false) {
            return res.status(400).json({success,error:"Enter Correct Credentials"});
        }

        //then generate and send its authToken
        const data = {
            user: {
                id: user.id
            }
        }
        const AuthData = jwt.sign(data, JWT_secret);
        success = true;
        res.json({ success,AuthData });


    } catch (error) {
        console.log(error.message);
        res.status(500).send(success,"Internal Server Error");
    }


})

//Route 3 -> fetching logged in userdetails using => POST "/api/auth/getUser"  logged in required. so Token is required


/*Authtoken will be sent in request, 
that auth token will be decoded and user id will be extracted from it and after that a user will be searched for that id and corresponding to that id, details of the user will be sent in response.*/


router.post('/getUser', fetchuser, async (req, res) => {


    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        res.json({user});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }


})

module.exports = router;