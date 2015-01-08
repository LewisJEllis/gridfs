/*eslint-env node, mocha */

var chai = require('chai');
var fs = require('fs');
var Grid = require('../index');
var mongo = require('mongodb');

var assert = chai.assert;

var MongoClient = mongo.MongoClient;
var mongoURI = 'mongodb://localhost:27017/gridfs-mocha-test';
var db, gfs;

describe('#gridfs', function () {
  before(function (done) {
    MongoClient.connect(mongoURI, function(err, dbconn) {
      assert.isNull(err);
      db = dbconn;
      gfs = Grid(db, mongo);
      done();
    });
  });

  afterEach(function (done) {
    // reset gridfs collections
    db.collection('fs.files').drop(function () {
      db.collection('fs.chunks').drop(function () {
        done();
      });
    });
  });

  it('does a fromFile - readFile round trip', function (done) {
    var filePath = './test/sample.txt';
    var contents = fs.readFileSync(filePath).toString();
    var f = gfs.fromFile({}, fs.createReadStream(filePath));
    f.save(function (err1, file) {
      assert.isNull(err1);
      assert.strictEqual(contents.length, file.length);
      gfs.readFile({_id: file._id}, function (err2, data) {
        assert.isNull(err2);
        assert.strictEqual(data.toString(), contents);
        done();
      });
    });
  });

  it('does a writeFile - toFile round trip', function (done) {
    var filePath = './test/output.txt';
    var contents = 'hello\n';
    gfs.writeFile({}, contents, function (err1, file) {
      assert.isNull(err1);
      gfs.toFile({_id: file._id}, filePath, function (err2) {
        assert.isNull(err2);
        assert.strictEqual(contents, fs.readFileSync(filePath).toString());
        fs.unlinkSync(filePath);
        done();
      });
    });
  });

});
