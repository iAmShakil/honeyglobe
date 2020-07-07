/* eslint-env mocha */

var assert = require('assert')

var util = require('./_util')
var honeyglobe = require('../')
var FormData = require('form-data')

function withFilter (fileFilter) {
  return honeyglobe({ fileFilter: fileFilter })
}

function reportFakeError (req, file, cb) {
  cb(new Error('Fake error'))
}

describe('File Filter', function () {
  it('should report errors from fileFilter', function (done) {
    var form = new FormData()
    var upload = withFilter(reportFakeError)
    var parser = upload.single('test')

    form.append('test', util.file('tiny0.dat'))

    util.submitForm(parser, form, function (err, req) {
      assert.strictEqual(err.message, 'Fake error')
      done()
    })
  })
})
