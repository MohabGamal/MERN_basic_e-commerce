const router = require('express').Router()
const Cart = require('../models/Cart')
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken')



// CREATE 
router.post('/', verifyToken, async (req, res) => {
    const newCart = new Cart(req.body)

    try {
        const savedCart = await newCart.save()
        res.status(200).json(savedCart)
    } catch (error) {
        res.status(500).json({error: error})
    }
})


// UPDATE 
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {

    try {
        const updatedCart = await Cart.findById(
            req.params.id,
            {$set: req.body},
            {new:true},
            )
        res.status(200).json(updatedCart)
    } catch (error) {
        res.status(500).json({error: error})
    }
    })


// DELETE 
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Deleted")
    } catch (error) {
        res.status(500).json({error: error})
    }
})

// GET
router.get("/find/:userId", verifyTokenAndAuthorization ,async (req, res) => {
    try {
        const cart = await Cart.findOne({ userI: req.params.userId})
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json({error: error})
    }
})

// Get All Carts
router.get("/", verifyTokenAndAdmin ,async (req, res) => {
 try {
    const carts = await Cart.find()
    res.status(200).json(carts)
 } catch (error) {
    res.status(500).json({error: error})
 }
})





module.exports = router