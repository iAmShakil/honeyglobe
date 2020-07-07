![Tests](https://github.com/iAmShakil/honeyglobe/workflows/Tests/badge.svg)


**honeyglobe** is a quick to configure middleware for handling multipart/form-data to upload files. It's a wrapper around the file uploading middleware named `multer`.

## Installation

```sh
$ npm install --save honeyglobe
```

```sh
$ yarn add honeyglobe
```

## Quick set up 
```javascript
var express = require('express')
var honeyglobe  = require('honeyglobe')
var upload = honeyglobe({
  destination: 'uploads/',
  fileTypes: ['jpg', 'jpeg', 'png', 'mp3', 'mp4'], // don't provide this field if you want to allow all file types.
})

var app = express()

app.post('/profile', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  // req.file is the file object for the uploaded file.

  // req.file.fieldname | 'e.g. 'avatar' (Field name specified in the form)
  // req.file.originalname | e.g. 'Screenshot 3 PM.png' (Name of the file on the user's computer)
  // req.file.encoding | e.g. '7bit' (Encoding type of the file)
  // req.file.mimetype | e.g. 'image/png' (Mime type of the file)
  // req.file.size | e.g. 106339 (Size of the file in bytes)
  // req.file.destination | e.g. 'uploads/' (The folder to which the file has been saved)
  // req.file.filename | e.g. 'avatar-043429cb75a6da996fa2e779392a673e.png' (The generated name of the file within the `destination`)
  // req.file.path | e.g. 'uploads/avatar-043429cb75a6da996fa2e779392a673e.png' (The full path to the uploaded file)
  res.send({
    fileName: req.file.filename
  })
})
```
The above code assumes you sent a `POST` request to the server. The `body` of the request is a `form-data` object which has the key `avatar` and a file is attached to the key.

If you want to upload an array of files in a field, use the `upload.array` method. If you want to upload multiple files using different fields in the same request, use the `upload.fields` method. Refer to these methods' respective sections to see how they are used or check out the example directory.

## Usage Description

honeyglobe adds a `body` object and a `file` or `files` object to the `request` object. The `body` object contains the values of the text fields of the form, the `file` or `files` object contains the files uploaded via the form.

Usage example:

Don't forget the `enctype="multipart/form-data"` in your form.

```html
<form action="/profile" method="post" enctype="multipart/form-data">
  <input type="file" name="avatar" />
</form>
```

```javascript
var express = require('express')
var honeyglobe  = require('honeyglobe')
var upload = honeyglobe({
  destination: 'uploads/'
})

var app = express()

app.post('/profile', upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
})

app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
})

var cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
app.post('/cool-profile', cpUpload, function (req, res, next) {
  // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
  //
  // e.g..
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // req.body will contain the text fields, if there were any
})
```

In case you need to handle a text-only multipart form, you should use the `.none()` method:

```javascript
var express = require('express')
var app = express()
var honeyglobe  = require('honeyglobe')
var upload = honeyglobe()

app.post('/profile', upload.none(), function (req, res, next) {
  // req.body contains the text fields
})
```

Here's an example on how it is used in an HTML form. Take special note of the `enctype="multipart/form-data"` and `name="uploaded_file"` fields:

```html
<form action="/stats" enctype="multipart/form-data" method="post">
  <div class="form-group">
    <input type="file" class="form-control-file" name="uploaded_file">
    <input type="text" class="form-control" placeholder="Number of speakers" name="nspeakers">
    <input type="submit" value="Get me the stats!" class="btn btn-default">            
  </div>
</form>
```

Then in your javascript file you would add these lines to access both the file and the body. It is important that you use the `name` field value from the form in your upload function. This tells honeyglobe which field on the request it should look for the files in. If these fields aren't the same in the HTML form and on your server, your upload will fail:

```javascript
var honeyglobe  = require('honeyglobe')
var upload = honeyglobe({ destination: './public/data/uploads/' })
app.post('/stats', upload.single('uploaded_file'), function (req, res) {
   // req.file is the name of your file in the form above, here 'uploaded_file'
   // req.body will hold the text fields, if there were any 
   console.log(req.file, req.body)
});
```


## API

### File information

Each file contains the following information:

Key | Description | Note
--- | --- | ---
`fieldname` | Field name specified in the form |
`originalname` | Name of the file on the user's computer |
`encoding` | Encoding type of the file |
`mimetype` | Mime type of the file |
`size` | Size of the file in bytes |
`destination` | The folder to which the file has been saved 
`filename` | The name of the file within the `destination`
`path` | The full path to the uploaded file

### `honeyglobe(opts)`

honeyglobe accepts an options object, the most basic of which is the `destination`
property, which tells honeyglobe where to upload the files.

By default, honeyglobe will rename the files so as to avoid naming conflicts. The
renaming function can be customized according to your needs.

The following are the options that can be passed to honeyglobe.

Key | Description
--- | ---
`destination` | Where to store the files
`fileTypes` | Array of allowed extensions
`limits` | Limits of the uploaded data
`preservePath` | Keep the full path of files instead of just the base name

In an average web app, only `destination` might be required, and configured as shown in
the following example.

```javascript
var honeyglobe = require('honeyglobe')
var upload = honeyglobe({ destination: 'uploads/' })
```

You can specify what file types to allow

```javascript
var honeyglobe = require('honeyglobe')
var upload = honeyglobe({
  destination: 'uploads/',
  fileTypes: ['jpg', 'jpeg', 'png', 'webp']
})
```
#### `.single(fieldname)`

Accept a single file with the name `fieldname`. The single file will be stored
in `req.file`.

#### `.array(fieldname[, maxCount])`

Accept an array of files, all with the name `fieldname`. Optionally error out if
more than `maxCount` files are uploaded. The array of files will be stored in
`req.files`.

#### `.fields(fields)`

Accept a mix of files, specified by `fields`. An object with arrays of files
will be stored in `req.files`.

`fields` should be an array of objects with `name` and optionally a `maxCount`.
Example:

```javascript
[
  { name: 'avatar', maxCount: 1 },
  { name: 'gallery', maxCount: 8 }
]
```

#### `.none()`

Accept only text fields. If any file upload is made, error with code
"LIMIT\_UNEXPECTED\_FILE" will be issued.

#### `.any()`

Accepts all files that comes over the wire. An array of files will be stored in
`req.files`.

**WARNING:** Make sure that you always handle the files that a user uploads.
Never add honeyglobe as a global middleware since a malicious user could upload
files to a route that you didn't anticipate. Only use this function on routes
where you are handling the uploaded files.

### `limits`

An object specifying the size limits of the following optional properties. honeyglobe passes this object into busboy directly, and the details of the properties can be found on [busboy's page](https://github.com/mscdex/busboy#busboy-methods).

The following integer values are available:

Key | Description | Default
--- | --- | ---
`fieldNameSize` | Max field name size | 100 bytes
`fieldSize` | Max field value size (in bytes) | 1MB
`fields` | Max number of non-file fields | Infinity
`fileSize` | For multipart forms, the max file size (in bytes) | Infinity
`files` | For multipart forms, the max number of file fields | Infinity
`parts` | For multipart forms, the max number of parts (fields + files) | Infinity
`headerPairs` | For multipart forms, the max number of header key=>value pairs to parse | 2000

Specifying the limits can help protect your site against denial of service (DoS) attacks.

## Error handling

When encountering an error, honeyglobe will delegate the error to Express. You can
display a nice error page using [the standard express way](http://expressjs.com/guide/error-handling.html).