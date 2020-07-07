const express = require('express')
const bodyParser = require('body-parser')
const honeyglobe = require('../src/index')

const PORT = process.env.PORT || 7000
const app = express()
app.use(bodyParser())

const upload = honeyglobe({
  destination: 'uploads/',
  fileTypes: ['jpeg', 'jpg', 'gif', 'png']
})

// Single file. The file is in 'avatar' field of formdata posted by the client
app.post('/uploadFile', upload.single('avatar'), (req, res) => {
  res.send({
    fileName: req.file.filename
  })
})

// Client sends multiple files in the 'photo' field
app.post('/uploadFileArray', upload.array('photo'), (req, res) => {
  const uploadFiles = req.files
  const uploadedFileNames = uploadFiles.map(file => file.filename)
  res.send({
    fileName: uploadedFileNames
  })
})

// upload files via multiple fields
var cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
app.post('/uploadFileFields', cpUpload, function (req, res, next) {
  // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
  //
  // e.g.
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // req.body will contain the text fields, if there were any
  const avatarFile = req.files.avatar[0]
  const galleryFiles = req.files.gallery
  const avatarFileName = avatarFile.filename
  const galleryFileNames = galleryFiles.map(galleryFile => {
    return galleryFile.filename
  })
  res.send({
    avatarFileName: avatarFileName,
    galleryFileNames: galleryFileNames
  })
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
