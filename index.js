var Grid = require('gridfs-stream');
var stream = require('stream');
var fs = require('fs');

function streamToBuffer(source, cb) {
  var chunks = [];
  var buffer = new stream.Writable();

  buffer._write = function (chunk) {
    chunks.push(chunk);
  };

  source.on('end', function () {
    cb(null, Buffer.concat(chunks));
  });

  source.pipe(buffer);
}

Grid.prototype.fromFile = function (options, source) {
  var ws = this.createWriteStream(options);
  var rs = typeof source === 'string' ? fs.createReadStream(source) : source;

  return {
    id: ws.id,
    save: function (cb) {
      ws.on('close', function (file) {
        return cb(null, file);
      });

      rs.pipe(ws);
    }
  };
};

Grid.prototype.toFile = function (options, target, cb) {
  var rs = this.createReadStream(options);
  var ws = typeof target === 'string' ? fs.createWriteStream(target) : target;

  rs.on('end', function () {
    cb(null);
  });

  rs.pipe(ws);
};

Grid.prototype.readFile = function (options, cb) {
  streamToBuffer(this.createReadStream(options), cb);
};

Grid.prototype.writeFile = function (options, data, cb) {
  data = typeof data === 'object' ? data.toString() : data;
  var ws = this.createWriteStream(options);

  ws.on('close', function (file) {
    cb(null, file);
  });

  ws.end(data);
};

module.exports = exports = Grid;
