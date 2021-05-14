'use strict';

// dependencies we're using
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
app.use(express.json());
require('dotenv').config();

// make sure you have dotenv installed as a dependency and you've created your own .env file
const PORT = process.env.PORT || 3001;
app.use(cors());

// connecting us to the mongoDB
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

// test to see if server is working
app.get('/', (request, response) => {
  response.send('hello from the headSpace test');
});

// seed database with a user

// creating routes and callbacks

// to get users (for building purposes, will remove this route after we can see created data)
// app.get('/users')

// to get moods for a specific user
// app.get('/moods')

// to "submit" a mood for a user (create a mood object)
// app.post('/moods')

// to delete a mood from a user's history
// app.delete('/moods/:id)

// to update a mood if the user desires
// app.put('/moods/:id)

app.listen(PORT, ()=> console.log(`Server is listening on PORT: ${PORT}`));
