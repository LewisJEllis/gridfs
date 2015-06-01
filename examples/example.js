var mongo = require('mongodb')
var Grid = require('../index')

var yourMongoURI = 'mongodb://localhost:27017/gridfs-example'

mongo.MongoClient.connect(yourMongoURI, function (err, db) {
  var gfs = Grid(db, mongo)

  var ws = gfs.fromFile({}, __dirname + '/example.txt', function (err, file) {
    console.log('saved file', ws.id === file._id)
    gfs.readFile({_id: file._id}, function (err, data) {
      console.log('read file: ' + data.toString())
    })
  })
  console.log(ws.id)

  gfs.writeFile({}, 'hello', function (err, file) {
    console.log('wrote to ' + file._id)
  })
})
