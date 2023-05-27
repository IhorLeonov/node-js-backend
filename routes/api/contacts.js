const express = require('express');
const ctrl = require('../../controllers/contacts');

const { validateBody } = require('../../middlewares');
// const { isValidId } = require('../../middlewares');

const { schemas } = require('../../models/contact');

const router = express.Router();

router.get('/', ctrl.getAll);

router.get('/:contactId', ctrl.getById);

router.post('/', validateBody(schemas.addSchema), ctrl.addContact);

router.put('/:contactId', validateBody(schemas.addSchema), ctrl.updateById);

router.patch(
    '/:contactId/favorite',
    validateBody(schemas.updateFavoriteSchema),
    ctrl.updateFavorite
);

router.delete('/:contactId', ctrl.deleteById);

module.exports = router;
