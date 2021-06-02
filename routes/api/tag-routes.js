const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (request, response) => {
  // Finding all tags
  // The Product model associated data is also included
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
  // Finds a single tag by its `id`
  // The Product model associated data is also included
  try {
    const tagData = await Tag.findByPk(request.params.id, {
      include: [{ model: Product }],
    });

    // If no tagData, a 404 error status is returned along with a message
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
  // Creates a new tag
  try {
    await Tag.create(request.body);
    response.status(200).json({ message: `The tag '${request.body.tag_name}' has been added` });
  } catch (error) {
    response.status(400).json(error);
  }
});

router.put('/:id', async (request, response) => {
  // Updates a tag's name by its `id` value
  try {
    const tagData = await Tag.update(request.body, {
      where: {
        id: request.params.id,
      },
    });

    // If no tagData, a 404 error status is returned along with a message
    if (!tagData[0]) {
      response.status(404).json({ message: 'No tag with this id!' });
      return;
    }
    response.status(200).json({ message: `Updated Tag id #${request.params.id}` });
  } catch (error) {
    response.status(500).json(error);
  }
});

router.delete('/:id', async (request, response) => {
  // Deletes a tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: {
        id: request.params.id,
      },
    });
    // If no tagData, a 404 error status is returned along with a message
    if (!tagData) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }
    
    response.status(200).json({ message: `Tag id #${request.params.id} has been removed` });
  } catch (error) {
    response.status(500).json(error);
  }
});

module.exports = router;
