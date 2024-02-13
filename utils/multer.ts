import multer from "multer";
import path from "path";


const storageEngine = multer.diskStorage({
  destination: `./images`,
  filename: (req, file, cb) => {
    cb(null, `${req.query.uuid}-${file.originalname}`);
  }
})

const checkType = (file: Express.Multer.File, cb: Function) => {
  const allowFileTypes = /jpeg|jpg|png|gif|svg/
  const checkResult = allowFileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = allowFileTypes.test(file.mimetype);
  if (mimeType && checkResult) {
    return cb(null, true);
  } else {
    cb("Error: type image error")
  }
}

const upload = multer({
  storage: storageEngine,
  limits: {
    fileSize: 10000000,
  },
  fileFilter: (req, file, cb) => {
    checkType(file, cb);
  }
})

export default upload;