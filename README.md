# Gridfs
The GridFS wrapper module for Node.js.

  [![NPM Version][npm-image]][npm-url]
  [![Build Status][travis-image]][travis-url]

```javascript
var fs = require('fs');
var mongo = require('mongodb');
var Grid = require('gridfs');

mongo.MongoClient.connect(yourMongoURI, function(err, db) {
  var gfs = Grid(db, mongo);

  gfs.fromFile({}, './example.txt', function (err, file) {
    console.log('saved example.txt to file ' + file._id);
    gfs.readFile({_id: file._id}, function (err, data) {
      console.log('read file ' + file._id + ': ' + data.toString());
    });
  });

  var contents = 'world';
  gfs.writeFile({}, contents, function (err, file) {
    console.log('wrote "' + contents + '" to file ' + file._id);
    gfs.toFile({_id: file._id}, './out.txt', function (err) {
      var fileContents = fs.readFileSync('./out.txt').toString();
      console.log('wrote file %s to out.txt: %s', file._id, fileContents);
    });
  });
});
```

This is a simple extension of the excellent [gridfs-stream](https://github.com/aheckmann/gridfs-stream) library, building on its stream interface to provide additional utility methods. As such, huge props to [@aheckmann](https://github.com/aheckmann) and the rest of the contributors to gridfs-stream.

`gridfs` can be used as a drop-in replacement for `gridfs-stream`, as it exports the same object as `gridfs-stream`, just with additional methods available.

# Installation
```
npm install gridfs
```

# Methods

All `options` fields are the same as `options` fields in [gridfs-stream](https://github.com/aheckmann/gridfs-stream); they're just passed along to the stream constructors.

#### gfs.readFile(options, cb(err, buffer))
Get the contents of the GridFS file specified by `options`.

#### gfs.writeFile(options, data, cb(err, file))
Write `data` to the GridFS file specified by `options`.

`data` can be a String or a Buffer.
#### gfs.toFile(options, target, cb(err))
Read from the GridFS file specified by `options` and write its contents to `target`.

`target` can be a file path or writable stream.

#### gfs.fromFile(options, source, cb(err, file))
Read from `source` and write its contents to the GridFS file specified by `options`.

`source` can be a file path or readable stream.

#### Notes on other potentially desirable `fs` methods
- `fs.stat` - use [gfs.findOne](https://github.com/aheckmann/gridfs-stream#accessing-file-metadata)
- `fs.unlink` - use [gfs.remove](https://github.com/aheckmann/gridfs-stream#removing-files)
- `fs.exists` - use [gfs.exist](https://github.com/aheckmann/gridfs-stream#check-if-file-exists)
- `fs.createReadStream` - use [gfs.createReadStream](https://github.com/aheckmann/gridfs-stream#createreadstream)
- `fs.createWriteStream` - use [gfs.createWriteStream](https://github.com/aheckmann/gridfs-stream#createwritestream)
- `fs.appendFile` - not currently feasible due to risk of corruption from parallel writes; see [MongoDB driver 2.0 notes](http://mongodb.github.io/node-mongodb-native/2.0/meta/changes-from-1.0/)

# Contributing
Pull requests are welcome. Guidelines: make sure `npm test` passes.

You'll need `mocha`, `eslint`, and mongo to run the tests; they use the `gridfs-mocha-test` database on the local mongo server.

[npm-image]: https://img.shields.io/npm/v/gridfs.svg?style=flat
[npm-url]: https://www.npmjs.com/package/gridfs
[travis-image]: https://img.shields.io/travis/LewisJEllis/gridfs.svg?style=flat
[travis-url]: https://travis-ci.org/LewisJEllis/gridfs
