const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// Getting all products when the '/api/products/' path is navigated to
router.get('/', async (request, response) => {
  // Finding all products
  // The Category and Tag model associated data are also included
  try {
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });
    response.status(200).json(productData);
  } catch (error) {
    response.status(500).json(error);
  }
});

// Getting one product by its id
router.get('/:id', async (request, response) => {
  // Finding a single product by its `id`
  // The Category and Tag model associated data are also included
  try {
    const productData = await Product.findByPk(request.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });
    // If no productData, a 404 error status is returned along with a message
    if(!productData) {
      response.status(404).json({ message: 'No product found with that id!' });
      return;
    }
    response.status(200).json(productData);
  } catch (error) {
    response.status(500).json(error);
  }
});

// Create new product
router.post('/', async (request, response) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */

  try {
    const productData = await Product.create(request.body);
    let productTagIds;
    // If there's product tags, we need to create pairings to bulk create in the ProductTag model
    if (request.body.tagIds.length) {
      const productTagIdArr = request.body.tagIds.map((tag_id) => {
        return {
          product_id: productData.id,
          tag_id,
        };
      });
      // Calls the bulkCreate function on the ProductTag model
      productTagIds = await ProductTag.bulkCreate(productTagIdArr);
    }
    while(!productTagIds) {
      // Responds with the status code and a message while there is no product tag ids
      response.status(200).json({ message: `The Product '${request.body.product_name}' has been added` });
    }
    // If product tag ids exist, responds with the status code and a message
    response.status(200).json({ message: `The Product '${request.body.product_name}' has been added along with the product tag ids` });
  } catch (error) {
    response.status(400).json(error);
  } 
});

// Updating a products information
router.put('/:id', async (request, response) => {
  try {
    // Update product data
    const productData = await Product.update(request.body, {
      where: {
        id: request.params.id,
      },
    })
    // Find all associated tags from ProductTag
    const productTagsData = await ProductTag.findAll({ where: { product_id: request.params.id } })
    
    // Get the list of current tag_ids
    const productTagIds = productTagsData.map(({ tag_id }) => tag_id);

    // Create filtered list of new tag_ids (the existing tag_ids are removed from the filtered list)
    const newProductTags = request.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: request.params.id,
          tag_id,
        };
      });
    
    // Determine which of the tag_ids to remove by looking at the productTagsData
    const productTagsToRemove = productTagsData
      .filter(({ tag_id }) => !request.body.tagIds.includes(tag_id))
      .map(({ id }) => id);
    
    // Run both destroy and builkCreate functions
    const updatedProductTags = await Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
    ]);
    response.status(200).json({ message: `Updated Product id #${request.params.id}` });
  } catch (error) {
    response.status(400).json(error);
  } 
});

router.delete('/:id', async (request, response) => {
  // Delete one product by its `id` value
  try {
    const productData = await Product.destroy({
      where: {
        id: request.params.id,
      },
    });
    // If no productData, a 404 error status is returned along with a message
    if (!productData) {
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    }

    response.status(200).json({ message: `Product id #${request.params.id} has been removed` });
  } catch (error) {
    response.status(500).json(error);
  }
});

module.exports = router;
