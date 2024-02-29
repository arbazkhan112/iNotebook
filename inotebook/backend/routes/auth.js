const express = require("express");
const usersModel = require("../models/Users");
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.post("/", [
    body('name').notEmpty().isLength({ min: 3 }),
    body('email').notEmpty().isEmail(),
    body('password').notEmpty().isLength({ min: 5 }),
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    usersModel.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }).then(user => res.send(user));


})

module.exports = router