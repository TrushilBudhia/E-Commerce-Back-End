const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (request, response) => {
  // Finding all categories
  // The Product model associated data is also included
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product }],
    });
    response.status(200).json(categoryData);
  } catch (error) {
    response.status(500).json(error);
  }
});

router.get('/:id', async (request, response) => {
  // Finds one category by its `id` value
  // The Product model associated data is also included
  try {
    const categoryData = await Category.findByPk(request.params.id, {
      include: [{ model: Product }],
    });

    // If no categoryData, a 404 error status is returned along with a message
    if(!categoryData) {
      response.status(404).json({ message: 'No category found with that id!' });
      return;
    }
    response.status(200).json(categoryData);
  } catch (error) {
    response.status(500).json(error);
  }
});

router.post('/', async (request, response) => {
  // Creates a new category
  try {
    await Category.create(request.body);
    response.status(200).json({ message: `The category '${request.body.category_name}' has been added` });
  } catch (error) {
    response.status(400).json(error);
  }
});

router.put('/:id', async (request, response) => {
  // Updates a category by its `id` value
  try {
    const categoryData = await Category.update(request.body, {
      where: {
        id: request.params.id,
      },
    });

    // If no categoryData, a 404 error status is returned along with a message
    if (!categoryData[0]) {
      response.status(404).json({ message: 'No category with this id!' });
      return;
    }
    response.status(200).json({ message: `Updated Category id #${request.params.id}` });
  } catch (error) {
    response.status(500).json(error);
  }
});

router.delete('/:id', async (request, response) => {
  // Deletes a category by its `id` value
  try {
    const categoryData = await Category.destroy({
      where: {
        id: request.params.id,
      },
    });

    // If no categoryData, a 404 error status is returned along with a message
    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    response.status(200).json({ message: `Category id #${request.params.id} has been removed` });
  } catch (error) {
    response.status(500).json(error);
  }
});

module.exports = router;
