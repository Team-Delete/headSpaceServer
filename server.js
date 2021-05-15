'use strict';

// dependencies we're using
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
app.use(express.json());

// requiring the "user" schema
const User = require('./schemas');

// make sure you have dotenv installed as a dependency and you've created your own .env file
const PORT = process.env.PORT || 3001;
app.use(cors());

// connecting us to the mongoDB
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

// test to see if server is working
app.get('/', (request, response) => {
  response.send('hello from the headSpace test');
});

// seed database with a user with no moods, commented out to avoid unused variables after initial save
// const newUser = new User({
//   email: '',
//   name: '',
//   moods: []
// });


//code below saves user to DB and returns console log
// newUser.save(function (err) {
//   if (err) console.log(err);
//   else console.log('it liiiiiives!', newUser);
// });

// creating routes and callbacks

// to get all existing users (for building purposes, will remove this route after we can see created data)
app.get('/users', (request, response) => {
  User.find((err, responseData) => {
    if (err) console.log(err);
    else response.send(responseData);
  });
});

// to get a specific user, and to create a new one if user doesn't already exist
app.get('users/:email', (request, response) => {
  let email = request.params.email;
  User.find({email: email}, (err, userData) =>{
    if(userData.length < 1) {
      // creates a new user
      let newUser = new User({email: request.params.email});
      newUser.save().then(newUserData => {
        console.log('here is new user data', newUserData);
        response.send([newUserData]);
      });
    } else {
      response.send(userData);
    }
  });
});

// to get moods for a specific user
// app.get('/moods')

// to "submit" a mood for a user (create a mood object)
// app.post('/moods')

// to delete a mood from a user's history
// app.delete('/moods/:id)

// to update a mood if the user desires
// app.put('/moods/:id)

app.listen(PORT, ()=> console.log(`Server is listening on PORT: ${PORT}`));
