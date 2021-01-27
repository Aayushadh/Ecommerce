import Order from '../models/orderModel.js'
import asyncHandler from 'express-async-handler'

const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
    } = req.body

    if (orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No order items')
        return
    } else {
        const order = new Order({
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            user: req.user._id,
        })

        const createdOrder = await order.save()
        res.status(201).json(createdOrder)
    }
})

const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    )
  
    if (order) {
      res.json(order)
    } else {
      res.status(404)
      throw new Error('Order not found')
    }
  })

  const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
    order.isPaid=true
    order.paidAt=Date.now()
    order.paymentResult={
      id:req.body.id,
      status:req.body.status,
      update_time:req.body.update_time,
      email_address:req.body.payer.email_address

    }
  
    if (order) {
      order.isPaid=true
    order.paidAt=Date.now()
    order.paymentResult={
      id:req.body.id,
      status:req.body.status,
      update_time:req.body.update_time,
      email_address:req.body.payer.email_address

    }
    const updateOrder = await order.save()

      res.json(updateOrder)
    } else {
      res.status(404)
      throw new Error('Order not found')
    }
  })

export { addOrderItems,getOrderById,updateOrderToPaid}
