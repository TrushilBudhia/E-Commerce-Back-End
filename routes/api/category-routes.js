const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (request, response) => {
  // find all categories
  // be sure to include its associated Products
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
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findByPk(request.params.id, {
      include: [{ model: Product }],
    });

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
  // create a new category
  try {
    const categoryData = await Category.create(request.body);
    response.status(200).json(categoryData);
  } catch (error) {
    response.status(400).json(error);
  }
});

router.put('/:id', async (request, response) => {
  // update a category by its `id` value
  try {
    const categoryData = await Category.update(request.body, {
      where: {
        id: request.params.id,
      },
    });
    if (!categoryData[0]) {
      response.status(404).json({ message: 'No category with this id!' });
      return;
    }
    response.status(200).json(categoryData);
  } catch (error) {
    response.status(500).json(error);
  }
});

router.delete('/:id', async (request, response) => {
  // delete a category by its `id` value
  try {
    const categoryData = await Category.destroy({
      where: {
        id: request.params.id,
      },
    });

    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }

    response.status(200).json(categoryData);
  } catch (error) {
    response.status(500).json(error);
  }
});

module.exports = router;
