const path = require('path')
const multer = require('multer')
const crypto = require('crypto')

function getRandomString (length = 16) {
  return crypto.randomBytes(length).toString('hex')
}

const fileName = (req, file, callback) => {
  callback(null, file.fieldname + '-' + getRandomString() + path.extname(file.originalname))
}

function checkFileType (file, cb, allowedFileTypes) {
  const regexString = allowedFileTypes.join('|')
  const filetypes = new RegExp(regexString)
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)
  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Error :File type is not permitted.'))
  }
}

const honeyglobe = (options = {}) => {
  const storage = multer.diskStorage({
    destination: options.destination,
    filename: (req, file, callback) => {
      if (options.fileName) {
        const fileName = options.fileName(req, file, path.extname(file.originalname))
        callback(null, fileName)
      } else {
        fileName(req, file, callback)
      }
    }
  })

  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (!options.fileTypes) {
        cb(null, true)
      } else {
        checkFileType(file, cb, options.fileTypes)
      }
    },
    ...options
  })
  return upload
}

module.exports = honeyglobe
module.exports.diskStorage = multer.diskStorage
module.exports.memoryStorage = multer.memoryStorage
module.exports.MulterError = multer.MulterError
