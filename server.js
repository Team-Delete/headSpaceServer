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

// DONE: connecting us to the mongoDB hosted on Atlas <-- persistent storage!
mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

// DONE: test to see if server is working <-- yup, it's working
app.get('/', (request, response) => {
  response.send('hello from the headSpace test');
});

const getWeather = require('./handlers/getWeather');
app.get('/weather', getWeather);

// creating routes and callbacks

// DONE: to get all existing users (for building purposes, will remove this route after we can see created data)
app.get('/users', (request, response) => {
  console.log(request.data);
  User.find((err, responseData) => {
    if (err) console.log(err);
    else response.send(responseData);
  });
});

// DONE: to get a specific user, and to create a new one if user doesn't already exist
app.get('/users/:email', (request, response) => {
  let email = request.params.email;
  User.find({email: email}, (err, userData) =>{
    if(userData.length < 1) {
      // creates a new user
      let newUser = new User({email: request.params.email});
      newUser.save().then(newUserData => {
        console.log('here is new user data', newUserData);
        response.send([newUserData]);
      });
    } if (err) {
      console.log(err);
      response.send(err);
    }else {
      response.send(userData);
    }
  });
});



// To Do: get moods for a specific user
app.get('/moods/:email', (request, response) => {
  // if I hard code my email, the request works:
  // let email = 'kassie.r.bradshaw@gmail.com';
  // request.params.email WORKS if browser reads: /moods/[user email]
  let email = request.params.email;
  console.log('here is request.params', request.params);
  User.find({email: email}, (err, userData) => {
    if (err) {
      console.log(err);
      response.send(err);
    } else {
      console.log(userData[0].moods);
      response.send(userData[0].moods);
    }
  });
});


// DONE: "submit" a mood for a user (create a mood object)
// To Do: Make sure it works dynamically with the front end
app.post('/moods', (request, response) => {
  console.log('here is the request.body', request.body);
  let email = request.body.email;
  User.find({email: email}, (err, responseData) => {
    console.log('this is responseData', responseData);
    if (responseData.length < 1) {
      response.status(400).send('user does not exist');
    } if (err) {
      console.log(err);
      response.send(err);
    }else {
      let user = responseData[0];
      user.moods.push({
        mood: request.body.mood,
        note: request.body.note,
      });
      user.save().then((userData) => {
        console.log(userData);
        response.send(userData.moods);
      });
    }
  });
});

// DONE: can update a mood's note if the user desires
// To Do: make sure it works dynamically with front end
app.put('/moods/:id', (request, response) => {
  let email = request.body.email;
  User.find({email: email}, (err, userData) => {
    if (err) {
      console.log(err);
      response.send(err);
    } else {
      console.log('this is userData', userData);
      let moodId = request.params.id;
      let user = userData[0];
      user.moods.forEach(mood => {
        if(`${mood._id}` === moodId) {
          // we found the correct mood, update the note
          mood.note = request.body.note;
        }
      });
      // save the updated mood note
      user.save().then(savedUserData => {
        response.send(savedUserData.moods);
      });
    }
  });
});

// DONE: delete a mood from a user's history
// TO DO: Make sure it works dynamically with front end
app.delete('/moods/:id', (request, response) => {
  let email = request.query.email;
  let id = request.params.id;
  // let id = '60a0273b3e5cc418db153a06';
  User.find({email: email}, (err, userData) => {
    if (err) {
      console.log(err);
      response.send(err);
    } else {
      let user = userData[0];
      user.moods = user.moods.filter(mood => `${mood._id}` !== id);
      user.save().then(userData => {
        response.status(200).send(userData.moods);
      });
    }
  });
});

app.listen(PORT, ()=> console.log(`Server is listening on PORT: ${PORT}`));
