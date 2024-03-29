/* eslint-env mocha */

var assert = require('assert')

var util = require('./_util')
var honeyglobe = require('../')
var FormData = require('form-data')
var temp = require('fs-temp')
var rimraf = require('rimraf')

describe('Reuse Middleware', function () {
  var parser
  var uploadDir

  before(function (done) {
    temp.mkdir(function (err, path) {
      if (err) done(err)
      uploadDir = path
      parser = honeyglobe({
        storage: honeyglobe.memoryStorage()
      }).array('them-files')
      done()
    })
  })

  after(function (done) {
    rimraf(uploadDir, done)
  })

  it('should accept multiple requests', function (done) {
    var pending = 8

    function submitData (fileCount) {
      var form = new FormData()

      form.append('name', 'honeyglobe')
      form.append('files', '' + fileCount)

      for (var i = 0; i < fileCount; i++) {
        form.append('them-files', util.file('small0.dat'))
      }

      util.submitForm(parser, form, function (err, req) {
        assert.ifError(err)

        assert.strictEqual(req.body.name, 'honeyglobe')
        assert.strictEqual(req.body.files, '' + fileCount)
        // assert.strictEqual(req.files.length, fileCount)
        req.files.forEach(function (file) {
          assert.strictEqual(file.fieldname, 'them-files')
          assert.strictEqual(file.originalname, 'small0.dat')
          assert.strictEqual(file.size, 1778)
          assert.strictEqual(file.buffer.length, 1778)
        })

        if (--pending === 0) done()
      })
    }

    submitData(9)
    submitData(1)
    submitData(5)
    submitData(7)
    submitData(2)
    submitData(8)
    submitData(3)
    submitData(4)
  })
})
