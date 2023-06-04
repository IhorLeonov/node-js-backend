const express = require('express');
const ctrl = require('../../controllers/users-controllers');

const { validateBody, authenticate, upload } = require('../../middlewares');
const { schemas } = require('../../schemas/user-schema');

const router = express.Router();

router.post('/register', validateBody(schemas.registerSchema), ctrl.register);
router.post('/login', validateBody(schemas.loginSchema), ctrl.login);
router.get('/current', authenticate, ctrl.getCurrent);
router.post('/logout', authenticate, ctrl.logout);

router.patch(
    '/',
    authenticate,
    validateBody(schemas.updateSubscriptionSchema),
    ctrl.updateSubscription
);

router.patch(
    '/avatars',
    authenticate,
    // upload.fields([{name: "avatar", maxCount: 1}, {name: "second-avatar", maxCount: 2}])  // - ожидаем файлы в нескольких полях
    // upload.array("avatar", 10), // - в одном поле несколько файлов (10)
    upload.single('avatar'),
    ctrl.updateAvatar
);

module.exports = router;
