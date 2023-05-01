const router = require('express').Router()
const Product = require('../models/Product')
const {veifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin} = require('./verifyToken')



// CREATE 
router.post('/', verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body)

    try {
        const savedProduct = await newProduct.save()
        res.status(200).json(savedProduct)
    } catch (error) {
        res.status(500).json({error: error})
    }
    })


// UPDATE 
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {

    try {
        const updatedProduct = await Product.findById(
            req.params.id,
            {$set: req.body},
            {new:true},
            )
        res.status(200).json(updatedProduct)
    } catch (err) {
        res.status(500).json({error: err})
    }
    })


// DELETE 
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {

    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Deleted")
    } catch (error) {
        res.status(500).json({error: error})
    }
})


// Find One Product
router.get("/find/:id", async (req, res) => {
    
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json({error: error})
    }
})

// Get All Products
router.get("/", async (req, res) => {
    // search for 5 new products option
    const qNew = req.query.new
    // search for products in this category
    const qCategory = req.query.category

    let products
    try {
        if (qNew){
            products = await Product.find().sort({_id:-1}).limit(5)
        }
        else if (qCategory){
             products = await Product.find({
                categories:{
                    $in: [qCategory],
                },
            })
        }
        else {products = await Product.find()}

        res.status(200).json(products)
    } catch (error) {
        res.status(500).json(error)
    }
})





module.exports = router