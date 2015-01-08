var mongo = require('mongodb');
var Grid = require('../index');

var yourMongoURI = 'mongodb://localhost:27017/gridfs-example'

mongo.MongoClient.connect(yourMongoURI, function(err, db) {
  var gfs = Grid(db, mongo);

  var f = gfs.fromFile({}, './example.txt');
  console.log(f.id);
  f.save(function (err, file) {
    console.log('saved file');
    gfs.readFile({_id: f.id}, function (err, data) {
      console.log('read file: ' + data.toString());
    });
  });

  gfs.writeFile({}, 'hello', function (err, file) {
    console.log('wrote to ' + file._id);
  });
});
