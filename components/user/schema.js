const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String,
    },
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    noTelp: {
        type: String,
    },
    alamat: {
        type: String,
    },
    profilePicture: {
        type: String,
    },
    roles: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "role"
        }
      ]
})

Object.assign(schema.statics, require('../../libraries/mongoose/statics'));

module.exports = mongoose.model('user', schema);