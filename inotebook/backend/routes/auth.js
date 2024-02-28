const express = require("express");
const usersModel = require("../models/Users");
const router = express.Router();

router.post("/", async (req,res)=>{
    const data = req.body;
    const user = await usersModel(data);
    const userdata = await user.save();
    console.log(userdata);
    res.send(userdata);
})

module.exports = router