const express = require("express");
const usersModel = require("../models/Users");
const { body, validationResult } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_Secret = "asdfASDF1@";

//Creating a user using POST "/api/auth/createuser". No login Required.
router.post("/createuser", [
    body('name').notEmpty().isLength({ min: 3 }),
    body('email').notEmpty().isEmail(),
    body('password').notEmpty().isLength({ min: 5 }),
], async (req, res) => {

    //Checking Errors for Validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        //Checking if user with this email already exists
        const user = await usersModel.findOne({ email: req.body.email });
        if (user) {
            res.status(400).json({ error: "A user with this email alreday exists" });
        }
        else {
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt)
            //Creeate a new user
            userdata = await usersModel.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass
            })
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, JWT_Secret)
            res.send({ authToken: authToken });
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal Server Error");
    }
})

router.post("/login", [
    body("email").isEmail(),
    body("password").exists()
], async (req, res) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        res.status(400).json({ error: error.array() });
    }

    const { email, password } = req.body
    try {

        const user = await usersModel.findOne({ email: email });
        if (!user) {
            return res.status(400).json({ error: "Please Enter Correct Credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Please Enter Correct Credentials" });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_Secret)
        res.send({ authToken: authToken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("internal Server Error");
    }
})

module.exports = router