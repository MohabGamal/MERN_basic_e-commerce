const router = require('express').Router()
const User = require('../models/User')
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken')


// GET All Users for admin
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    // search for 5 new users option
    const query = req.query.new
    try {
        const users = query
        ? await User.find().sort({_id:-1}).limit(5)
        : await User.find()
        const user = await User.findById(req.params.id)
        
        const { password,  ...others} = user._doc
        res.status(200).json(others)
    } catch (error) {
        res.status(500).json(error)
    }
})

// GET User Stats for Dashboard
router.get("/states", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date()
    const LastYear = new Date(date.setFullYear(Date.getFullYear() - 1))

    try {
        const data = await User.aggregate([
            {$match: {
                createdAt: {$gte: LastYear}}},

            {$project: {
                month: {$month: "$createdAt"}}},

            {$group: {
                _id: '$month',
                total: {$sum: 1}}},
        ])
        res.status(200).render(data)
    } catch (error) {
        
    }
});


// UPDATE 
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASS_SEC).toString()
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {$set: req.body,},
            {new: true},
        )
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json(error)
    }
})


// GET One User for Admin
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        
        const { password,  ...others} = user._doc
        res.status(200).json(others)
    } catch (error) {
        res.status(500).json(error)
    }
})


// DELETE 
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("Deleted")
    } catch (error) {
        res.status(500).json(error)
    }
})




module.exports = router