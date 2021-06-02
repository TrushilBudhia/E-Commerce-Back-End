// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Categories have many Products
Category.hasMany(Product, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE',
});

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id',
});


// Products belongToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  through: ProductTag,
  foreignKey: 'product_id',
});

// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignKey: 'tag_id',
});

// // Product tag belongsTo Product
// ProductTag.belongsTo(Product, {
//   // foreignKey: 'product_id',
// });

// // Product has many Product Tags
// Product.hasMany(ProductTag, {
//   // foreignKey: 'product_id',
//   onDelete: 'CASCADE',
// });

// // Product tag belongsTo Tag
// ProductTag.belongsTo(Tag, {
//   // foreignKey: 'tag_id',
// });

// // Tag has many Product Tags
// Tag.hasMany(ProductTag, {
//   // foreignKey: 'tag_id',
//   onDelete: 'CASCADE',
// });

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
