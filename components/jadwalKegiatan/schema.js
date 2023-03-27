const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    namaKegiatan: {
        type: String,
    },
    tanggalKegiatan: {
        type: Date,
    },
})

Object.assign(schema.statics, require('../../libraries/mongoose/statics'));

module.exports = mongoose.model('jadwalKegiatan', schema);