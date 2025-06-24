require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const itemsRoute = require('./routes/items');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());


app.use('/api/items', itemsRoute);


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log(err));
