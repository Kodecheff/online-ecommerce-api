import path from 'path'
import multer from 'multer'

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function(req, file, cb){
    let ext = path.extname(file.originalname)

    cb(null, Date.now() + ext)
  }
})

const upload = multer({
  storage,
  fileFilter: function(req, file, cb){
    if(file.mimetype == 'image/jpg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpeg'){
      cb(null, true)
    }else{
      console.log('File format not supported.')
      cb(null, false)
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 3
  }
})

export default upload