const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    deskripsi: {
        type: String,
    },
    waktuKegiatan: {
        type: String,
    },
    tempatKegiatan: {
        type: String,
    },
    posterKegiatan: {
        type: String,
    }
})

Object.assign(schema.statics, require('../../libraries/mongoose/statics'));

module.exports = mongoose.model('rincianKegiatan', schema);