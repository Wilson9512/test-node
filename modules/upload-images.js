const multer = require('multer');
const {v4: uuidv4} = require('uuid');

const extMap = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
};

const storage  = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/../public/img')//整個用戶都看得到,要做分層要處理session
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + extMap[file.mimetype] );
    },
});

const fileFilter = (req, file, cb) => {
    cb(null, !!extMap[file.mimetype]);
};//先進到這篩選

module.exports = multer({storage, fileFilter});