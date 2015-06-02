var fs = require('fs');
var mongo = require('mongodb');
var Grid = require('../index');

var yourMongoURI = 'mongodb://localhost:27017/gridfs-example'

mongo.MongoClient.connect(yourMongoURI, function(err, db) {
  var gfs = Grid(db, mongo);

  var source = './example.txt';
  gfs.fromFile({filename: 'hello.txt'}, source, function (err, file) {
    console.log('saved example.txt to file ' + file._id);
    gfs.readFile({_id: file._id}, function (err, data) {
      console.log('read file ' + file._id + ': ' + data.toString());
    });
  });

  var contents = 'world';
  gfs.writeFile({filename: 'world.txt'}, contents, function (err, file) {
    console.log('wrote "' + contents + '" to file ' + file._id);
    gfs.toFile({_id: file._id}, './out.txt', function (err) {
      var fileContents = fs.readFileSync('./out.txt').toString();
      console.log('wrote file %s to out.txt: %s', file._id, fileContents);
    });
  });

  setTimeout(function () {
    gfs.list(function (err, filenames) {
      console.log('filenames: ' + filenames); // hello.txt, world.txt
    });
  }, 100);
});
