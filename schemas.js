'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// this will be the structure of a "mood object"
const moodSchema = new Schema({
  email: {type: String},
  mood: {type: String},
  note: {type: String},

});

// this will be the structure of each user, and it will contain all their previously voted moods
const userSchema = new Schema({
  email: String,
  name: String,
  moods: [moodSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
