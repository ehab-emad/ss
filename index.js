const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
require('dotenv').config();  // لتحميل متغيرات البيئة

// إعداد AWS S3
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'your-region'
});

const s3 = new aws.S3();

// إعداد Multer مع S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'your-bucket-name',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname); // اسم الملف الفريد
    }
  })
});

// نقطة تحميل الصور
server.post('/products', upload.single('image'), (req, res) => {
  req.body.image = req.file.location;  // رابط الصورة في S3
  res.status(200).json({ success: true, imageUrl: req.file.location });
});

server.use(middlewares);
server.use(router);
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
