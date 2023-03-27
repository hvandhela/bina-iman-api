const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String,
    },
    created: {
        by: String,
        at: Date,
        userId: String,
      },
      updated: {
        by: String,
        at: Date,
        userId: String,
      },
})

Object.assign(schema.statics, require('../../libraries/mongoose/statics'));

module.exports = mongoose.model('lingkungan', schema);