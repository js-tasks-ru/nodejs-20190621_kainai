const Order = require('../models/Order');

module.exports.checkout = async function checkout(ctx, next) {
  const order = new Order({
    user: ctx.user.id,
    product: ctx.request.body.product,
    phone: ctx.request.body.phone,
    address: ctx.request.body.address,
  });

  await order.save();

  ctx.body = {order: order.id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({user: ctx.user}).populate('product');
  ctx.body = {orders};
};
