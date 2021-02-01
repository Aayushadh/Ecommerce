import Product from '../models/productModel.js'
import asyncHandler from 'express-async-handler'

const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({})
    res.json(products)
})

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) {
        await product.remove()
        res.json('Deleted successfully')
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if (product) res.json(product)
    else res.status(404).send({ message: 'not found' })
})

const addProduct = asyncHandler(async (req, res) => {
    
    const obj = {
        name:"Sample Name",
        price:0,
        brand:"Sample brand",
        countInStock:0,
        numReviews:0,
        rating:0,
        image:"/images/sample.jpg",
        description:"Sample Description",
        category:"Sample Category",
        user:req.user._id
    }

    const product = await Product.create(obj);
    res.status(201).send(product)
    

})

const updateProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)

    if (product) {
        product.name = req.body.name || product.name ,
        product.price = req.body.price || product.price,
        product.brand = req.body.brand || product.brand,
        product.countInStock = req.body.countInStock || product.countInStock,
        product.numReviews = req.body.numReviews || product.numReviews,
        product.rating = req.body.rating || product.rating,
        product.image = req.body.image || product.image,
        product.description= req.body.description || product.description,
        product.category = req.body.category || product.category

        const updatedProduct = await product.save()

        res.json(updatedProduct)
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})
export { getProducts, getProductById,deleteProduct,addProduct,updateProductById}
