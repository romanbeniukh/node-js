const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connect = require('./db/connect')
const { contactsRouter } = require('./routes/contacts.router');

require('dotenv').config({ path: './.env' });

const app = express();

connect();

app.use(cors());

app.use(morgan('tiny'));

app.use('/', express.static('public'));

app.use(express.json());

app.use('/contacts', contactsRouter);

app.listen(3000, () => console.log('Server listening on port: 3000'));
