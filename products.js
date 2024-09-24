const mongoose = require('mongoose');

let dataSchema = new mongoose.Schema({

    //id will be automatically generated
    'pname':{
        required: true,
        type: String
    },
    'pprice':{
        required: true,
        type: String
    },
    'pdesc':{
        required: true,
        type: String
    },
});

//here we will define modeule export and will defines our collections and it will just export it.

module.exports = mongoose.model("node_js",dataSchema);
