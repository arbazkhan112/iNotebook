const express = require("express");
const usersModel = require("../models/Users");
const { body, validationResult } = require('express-validator');
const router = express.Router();

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
            //Creeate a new user
            userdata = await usersModel.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })

            res.send(userdata);
        }

    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router