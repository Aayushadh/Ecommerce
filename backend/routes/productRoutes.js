import express from 'express'
import {
    getProducts,
    getProductById,
    deleteProduct,
    addProduct,
    updateProductById,
} from '../controllers/productController.js'
import {protect,admin} from '../middlewares/authmiddleware.js'  

const router = express.Router()

router.route('/').get(getProducts).post(protect,admin,addProduct)

router.route('/:id').get(getProductById).delete(protect,admin,deleteProduct).put(protect,admin,updateProductById)

export default router
