const { ctrlWrapper } = require('../decorators');
const { HttpError } = require('../helpers');
const { Contact } = require('../models/contact.js');

const listContacts = async (_, res) => {
    // const result = await Contact.find({ name: "Kennedy Lane", phone: "(992) 914-3792" }); // вернет все поля с такими значениями
    const result = await Contact.find({}, '-createdAt -updatedAt');
    res.json(result);
};

const getContactById = async (req, res) => {
    const { contactId } = req.params;
    // const result = await Contact.findOne({ _id: contactId }); // можно искать по разным полям
    const result = await Contact.findById(contactId);

    if (!result) {
        throw new HttpError(404, 'Not found');
    }
    res.json(result);
};

const addContact = async (req, res) => {
    const result = await Contact.create(req.body);
    res.status(201).json(result);
};

const updateContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
        new: true,
    }); // new: true - для того, чтобы возвращался новый объект
    if (!result) {
        throw new HttpError(404, 'Not found');
    }
    res.json(result);
};

const updateStatusContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
        new: true,
    });
    if (!result) {
        throw new HttpError(404, 'Not found');
    }
    res.json(result);
};

const removeContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndRemove(contactId);
    if (!result) {
        throw new HttpError(404, 'Not found');
    }
    res.json({
        message: 'contact deleted',
    });
};

module.exports = {
    getAll: ctrlWrapper(listContacts),
    getById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    updateById: ctrlWrapper(updateContact),
    updateFavorite: ctrlWrapper(updateStatusContact),
    deleteById: ctrlWrapper(removeContact),
};
