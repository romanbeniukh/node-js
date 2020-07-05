const mongoose = require('mongoose');

const connect = () => {
  try {
    mongoose.connect(process.env.DB_CONNECTION, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('Database connection successful');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connect