const { User } = require('../models/user');
const { ctrlWrapper } = require('../decorators');
const { HttpError } = require('../helpers');
const { SECRET_KEY } = process.env;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs/promises');
const path = require('path');
const gravatar = require('gravatar');
const Jimp = require('jimp');

const avatarsPath = path.resolve('public', 'avatars');

const register = async (req, res) => {
    const { email, password } = req.body;

    const ava = gravatar.url(email, { size: '250' });
    const user = await User.findOne({ email });

    if (user) {
        throw new HttpError(409, 'Email already in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        ...req.body,
        avatarURL: ava,
        password: hashPassword,
    });

    res.status(201).json({
        user: {
            name: newUser.name,
            email: newUser.email,
            subscription: newUser.subscription,
        },
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw new HttpError(401, 'Email or password is wrong');
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
        throw new HttpError(401, 'Email or password is wrong');
    }

    const payload = {
        id: user._id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '23h' });
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
        },
    });
};

const getCurrent = async (req, res) => {
    const { email, name, subscription } = req.user;

    res.json({
        email,
        name,
        subscription,
    });
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: '' });

    res.json({
        message: 'Logout succeess',
    });
};

const updateSubscription = async (req, res) => {
    const { _id } = req.user;
    const result = await User.findByIdAndUpdate(_id, req.body, {
        new: true,
    });

    if (!result) {
        throw new HttpError(404, 'Not found');
    }
    res.json({
        name: result.name,
        subscription: result.subscription,
    });
};

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: oldPath, filename } = req.file;

    const newPath = path.join(avatarsPath, filename);
    await fs.rename(oldPath, newPath);
    const avatarUrl = path.join('public', 'avatars', filename);

    const normalizedAvatar = Jimp.read(avatarUrl)
        .then(img => {
            return img.resize(250, 250).write(avatarUrl);
        })
        .catch(error => {
            throw new HttpError(404, `${error.message}`);
        });

    const result = await User.findByIdAndUpdate(_id, normalizedAvatar, {
        new: true,
    });

    if (!result) {
        throw new HttpError(404, 'Not found');
    }

    res.json({
        user: result.email,
        avatarURL: avatarUrl,
    });
};

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
};
