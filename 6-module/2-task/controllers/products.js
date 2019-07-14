const Product = require('../models/Product');
const mongoose = require('mongoose');

// {
//   products: [
//     {
//       id: '5d20cf5bba02bff789f8e29f',
//       title: 'Product1',
//       images: ['image1', 'image2'],
//       category: '5d20cf5bba02bff789f8e29d',
//       subcategory: '5d20cf5bba02bff789f8e29e',
//       price: 10,
//       description: 'Description1'
//     }
//   ]
// }

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategory = ctx.query.subcategory;
  try {
    const productBySubCat = await Product.find({subcategory: subcategory});
    ctx.body = {
      products: productBySubCat.map((item) => ({
        id: item._id,
        title: item.title,
        images: item.images,
        category: item.category,
        subcategory: item.subcategory,
        price: item.price,
        description: item.description,
      })),
    };
  } catch (err) {
    if (err instanceof mongoose.CastError) ctx.body = {products: []};
  }
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  ctx.body = {products: products};
};

module.exports.productById = async function productById(ctx, next) {
  const product = await Product.findOne({_id: ctx.params.id});
  if (!product) {
    ctx.throw(404);
  } else {
    ctx.body = {product: {...product, id: product._id}};
  }
};
