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

  it('does a fromFile - readFile round trip (path source)', function (done) {
    var filePath = './test/sample.txt';
    var source = filePath;
    var contents = fs.readFileSync(filePath).toString();
    gfs.fromFile({}, source, function (err1, file) {
      assert.isNull(err1);
      assert.strictEqual(contents.length, file.length);
      gfs.readFile({_id: file._id}, function (err2, data) {
        assert.isNull(err2);
        assert.strictEqual(data.toString(), contents);
        done();
      });
    });
  });

  it('does a fromFile - readFile round trip (stream source)', function (done) {
    var filePath = './test/sample.txt';
    var source = fs.createReadStream(filePath);
    var contents = fs.readFileSync(filePath).toString();
    gfs.fromFile({}, source, function (err1, file) {
      assert.isNull(err1);
      assert.strictEqual(contents.length, file.length);
      gfs.readFile({_id: file._id}, function (err2, data) {
        assert.isNull(err2);
        assert.strictEqual(data.toString(), contents);
        done();
      });
    });
  });

  it('does a writeFile - toFile round trip (path target)', function (done) {
    var filePath = './test/output.txt';
    var target = filePath;
    var contents = 'hello\n';
    gfs.writeFile({}, contents, function (err1, file) {
      assert.isNull(err1);
      gfs.toFile({_id: file._id}, target, function (err2) {
        assert.isNull(err2);
        assert.strictEqual(contents, fs.readFileSync(filePath).toString());
        fs.unlinkSync(filePath);
        done();
      });
    });
  });

  it('does a writeFile - toFile round trip (stream target)', function (done) {
    var filePath = './test/output.txt';
    var target = fs.createWriteStream(filePath);
    var contents = 'hello\n';
    gfs.writeFile({}, contents, function (err1, file) {
      assert.isNull(err1);
      gfs.toFile({_id: file._id}, target, function (err2) {
        assert.isNull(err2);
        assert.strictEqual(contents, fs.readFileSync(filePath).toString());
        fs.unlinkSync(filePath);
        done();
      });
    });
  });

  it('does a writeFile - toFile round trip (buffer contents)', function (done) {
    var filePath = './test/output.txt';
    var target = filePath;
    var contents = new Buffer('hello\n');
    gfs.writeFile({}, contents, function (err1, file) {
      assert.isNull(err1);
      gfs.toFile({_id: file._id}, target, function (err2) {
        assert.isNull(err2);
        assert.strictEqual(contents.toString(), fs.readFileSync(filePath).toString());
        fs.unlinkSync(filePath);
        done();
      });
    });
  });

  it('reads an empty file list', function (done) {
    gfs.list(function (err, filenames) {
      assert.isNull(err);
      assert.strictEqual(filenames.length, 0);
      done();
    });
  });

  it('reads a non-empty file list', function (done) {
    var filename = 'hello.txt';
    gfs.writeFile({filename: filename}, 'hello', function (err1, file) {
      assert.isNull(err1);
      gfs.list(function (err2, filenames) {
        assert.isNull(err2);
        assert.strictEqual(filenames.length, 1);
        assert.strictEqual(filenames[0], filename);
        assert.strictEqual(filenames[0], file.filename);
        done();
      });
    });
  });

});
