const { Schema, model } = require('mongoose');
const { handleMongooseError } = require('../helpers');
const Joi = require('joi');

const phoneRegex = /^((8|\+7)[ ]?)?(\(?\d{3}\)?[ ]?)?[\d\- ]{7,10}$/;
const phoneRegexError = {
    'string.pattern.base': `Incorrect phone number.`,
};

const contactSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Set name for contact'],
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        favorite: {
            type: Boolean,
            default: false,
        },
    },
    { versionKey: false, timestamps: true }
);

contactSchema.post('save', handleMongooseError);

const addSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().regex(phoneRegex).messages(phoneRegexError).required(),
    favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
});

const schemas = {
    addSchema,
    updateFavoriteSchema,
};

const Contact = model('contact', contactSchema);

module.exports = {
    Contact,
    schemas,
};
