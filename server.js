const mongoose = require('mongoose');
const app = require('./app');
const { DB_HOST, PORT = 3000 } = process.env;

mongoose
    .connect(DB_HOST)
    .then(() => {
        app.listen(PORT, () => {
            console.log('Database connection successful');
        });
    })
    .catch(error => {
        console.log(error.message);
        process.exit(1);
    });

// async function maine() {
//     await mongoose.connect(process.env.DB_HOST);

//     console.log('Database connection successful');

//     const contactSchema = new mongoose.Schema({
//         name: {
//             type: String,
//             required: [true, 'Set name for contact'],
//         },
//         email: {
//             type: String,
//         },
//         phone: {
//             type: String,
//         },
//         favorite: {
//             type: Boolean,
//             default: false,
//         },
//     });
// }
// maine().catch(console.error);
