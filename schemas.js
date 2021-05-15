'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// this will be the structure of a "mood object"
const moodSchema = new Schema({
  mood: {type: String},
  color: {type: String},
  number: {type: Number},
  // date: date.now(); <-- how do I get this default working?
});

// this will be the structure of each user, and it will contain all their previously voted moods
const userSchema = new Schema({
  email: String,
  name: String,
  moods: [moodSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
