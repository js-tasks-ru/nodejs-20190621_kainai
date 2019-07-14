const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();
  const prepCategories = categories.map((item) => ({
    title: item.title,
    id: item._id,
    subcategories: item.subcategories.map((it) => ({
      title: it.title,
      id: it._id,
    })),
  }));
  ctx.body = {categories: prepCategories};
};
