const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email']
  },
  password: { 
    type: String, 
    required: true,
    minlength: 8
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\+(?:[0-9] ?){6,14}[0-9]$/.test(v);
      },
      message: props => `${props.value} is not a valid international phone number!`
    }
  },
  address: {
    street: { type: String, maxlength: 100 },
    city: { type: String, maxlength: 50 },
    state: { type: String, maxlength: 50 },
    zipCode: { type: String, maxlength: 20 }
  },
  profilePicture: {
    type: String,
    default: 'https://res.cloudinary.com/dpz6ivjry/image/upload/v1681234567/default-avatar.png'
  },
  socialLinks: {
    website: {
      type: String,
      match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'Invalid URL']
    },
    twitter: {
      type: String,
      match: [/https?:\/\/(www\.)?x\.com\/[A-Za-z0-9_]{1,15}/, 'Invalid X URL']
    },
    instagram: {
      type: String,
      match: [/https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_]/i, 'Invalid Instagram URL']
    },
    mal: {
      type: String,
      match: [/https?:\/\/(www\.)?myanimelist\.net\/profile\/[A-Za-z0-9_]/i, 'Invalid MyAnimeList URL']
    },
    anilist: {
      type: String,
      match: [/https?:\/\/(www\.)?anilist\.co\/user\/[A-Za-z0-9_]/i, 'Invalid AniList URL']
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);