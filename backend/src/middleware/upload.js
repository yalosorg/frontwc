const multer = require('multer');
const moment = require('moment');   

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/tpm');
    },
    filename: (req, file, cb) => {
        const date = moment().format('DDDMMYYYY-HHmmss_SSS');
        cb(null, `${date}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/x-zip-compressed' || file.mimetype === 'application/zip') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

module.exports = multer({ 
    storage,
    fileFilter
}); 