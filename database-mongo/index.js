var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;

db.on('error', function () {
  // console.log('mongoose connection error');
});

db.once('open', function () {
  // console.log('mongoose connected successfully');
});

var itemSchema = mongoose.Schema({
  name: String,
  id: String,
  price: String,
  image: String,
  desc: String
});

var listSchema = mongoose.Schema({
  list: [itemSchema]
})
var List = mongoose.model('List', listSchema);

var Item = mongoose.model('Item', itemSchema);

var selectAll = function (callback) {
  Item.find({}, function (err, items) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, items);
    }
  });
};

var addItem = (itemObj, callback) => {
  newItem = new Item(itemObj);
  newItem.save(function (err) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, itemObj.name);
    }
  });
}

var addList = (array, callback) => {
  var list = new List()
  array.map(obj => {
    var mod = new Item(obj);
  })

}

module.exports.selectAll = selectAll;
module.exports.addItem = addItem;