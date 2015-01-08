# Gridfs
The GridFS wrapper module for Node.js.

  [![NPM Version][npm-image]][npm-url]
  [![Build Status][travis-image]][travis-url]

```javascript
var mongo = require('mongodb');
var Grid = require('gridfs');

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

```

This is an extension of [gridfs-stream](https://github.com/aheckmann/gridfs-stream), building on its stream interface to provide additional utility methods. As such, huge props to [@aheckmann](https://github.com/aheckmann) and the rest of the contributors to gridfs-stream.

This library is currently quite incomplete, but the plan is primarily to mirror a selection of functions from the core `fs` API.

`gridfs` can be used as a drop-in replacement for `gridfs-stream`, as it exports the same object as `gridfs-stream`, just with additional methods available.

# Installation
```
npm install gridfs
```

# Usage
See the example above, and [gridfs-stream](https://github.com/aheckmann/gridfs-stream).

# Methods
```
gfs.readFile(options, cb(err, buffer))
gfs.writeFile(options, data, cb(err, file))
gfs.toFile(options, target, cb(err))
gfs.fromFile(options, source) -> {id, save(cb(err, file))}
```
`options` fields are the same as `options` fields in [gridfs-stream](https://github.com/aheckmann/gridfs-stream); they're just passed along to the stream constructors.

`target` can be a file path or writable stream; likewise for `source`, but readable.

More thorough docs will be written once the API stabilizes and the library is more complete. The source is simple enough for anyone familiar with `gridfs-stream` to read.

# Contributing
Pull requests are welcome. Guidelines: make sure `npm test` passes.

You'll need `mocha`, `eslint`, and mongo to run the tests; they use the `gridfs-mocha-test` database on the local mongo server.

[npm-image]: https://img.shields.io/npm/v/gridfs.svg?style=flat
[npm-url]: https://www.npmjs.com/package/gridfs
[travis-image]: https://img.shields.io/travis/lewisjellis/gridfs.svg?style=flat
[travis-url]: https://travis-ci.org/lewisjellis/gridfs
