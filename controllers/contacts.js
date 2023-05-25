// const contacts = require('../models/contacts.js');
const Contact = require('../models/contact.js');

// const { HttpError } = require('../helpers');
const { ctrlWrapper } = require('../decorators');

const listContacts = async (_, res) => {
    const result = await Contact.find();
    res.json(result);
};

// const getContactById = async (req, res, next) => {
//     const { contactId } = req.params;
//     const result = await contacts.getContactById(contactId);
//     if (!result) {
//         throw HttpError(404, 'Not Found');
//     }
//     res.json(result);
// };

// const addContact = async (req, res, next) => {
//     const result = await contacts.addContact(req.body);
//     res.status(201).json(result);
// };

// const updateContact = async (req, res, next) => {
//     const { contactId } = req.params;
//     const result = await contacts.updateContact(contactId, req.body);
//     if (!result) {
//         throw HttpError(404, 'Not found');
//     }
//     res.json(result);
// };

// const removeContact = async (req, res, next) => {
//     const { contactId } = req.params;
//     const result = await contacts.removeContact(contactId);
//     if (!result) {
//         throw HttpError(404, 'Not found');
//     }
//     res.json({
//         message: 'contact deleted',
//     });
// };

module.exports = {
    getAll: ctrlWrapper(listContacts),
    // getById: ctrlWrapper(getContactById),
    // add: ctrlWrapper(addContact),
    // updateById: ctrlWrapper(updateContact),
    // deleteById: ctrlWrapper(removeContact),
};
