const express = require("express");
const router = express.Router();

router.get("/", (req,res)=>{
    res.send("Notes API called");
})

module.exports = router;