const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { contactsRouter } = require('./routes/contacts.router');

const app = express();

app.use(cors());

app.use(morgan('tiny'));

app.use('/', express.static('public'));

app.use(express.json());

app.use('/contacts', contactsRouter);

app.listen(3000, () => console.log('Server listening on port: 3000'));
