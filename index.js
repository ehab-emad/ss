
const jsonServer = require('json-server');
const multer = require('multer');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router('./db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3090;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/');
  },
  filename: function (req, file, cb) {
    let data = new Date();
    let images = "images/" + file.originalname;
    req.body.images = images;
    cb(null, images);
  }
});

const bodyParser = multer({ storage: storage }).any();

// استخدام middlewares و router قبل الاستماع للمنفذ
server.use(middlewares);
server.use(bodyParser);

server.post("/products", (req, res, next) => {
  let data = new Date();
  // req.body.createdAt = data.toISOString();

  // Continue to JSON Server router
  next();
});

server.use(router);

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
