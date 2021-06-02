const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (request, response) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product }],
    });
    response.status(200).json(tagData);
  } catch (error) {
    response.status(500).json(error);
  }
});

router.get('/:id', async (request, response) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(request.params.id, {
      include: [{ model: Product }],
    });

    if(!tagData) {
      response.status(404).json({ message: 'No tag found with that id!' });
      return;
    }
    response.status(200).json(tagData);
  } catch (error) {
    response.status(500).json(error);
  }
});

router.post('/', async (request, response) => {
  // create a new tag
  try {
    const tagData = await Tag.create(request.body);
    response.status(200).json(tagData);
  } catch (error) {
    response.status(400).json(error);
  }
});

router.put('/:id', async (request, response) => {
  // update a tag's name by its `id` value
  try {
    const tagData = await Tag.update(request.body, {
      where: {
        id: request.params.id,
      },
    });
    if (!tagData[0]) {
      response.status(404).json({ message: 'No tag with this id!' });
      return;
    }
    response.status(200).json(tagData);
  } catch (error) {
    response.status(500).json(error);
  }
});

router.delete('/:id', async (request, response) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: {
        id: request.params.id,
      },
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }

    response.status(200).json(tagData);
  } catch (error) {
    response.status(500).json(error);
  }
});

module.exports = router;
