const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('node:path');
const crypto = require('node:crypto');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const userId = req.user.id;
    let folder;
    let filename;

    switch (file.fieldname) {
      case 'avatar':
        folder = 'avatars';
        filename = userId;
        break;
      case 'cocktail':
        folder = 'cocktails';
        filename = generateFilename(file);
        break;
      default:
        folder = 'others';
        filename = generateFilename(file);
    }

    return {
      folder,
      allowed_formats: ['jpg', 'png'],
      public_id: filename,
      transformation: [{ width: 100, height: 100 }, { quality: 'auto' }],
    };
  },
});

const generateFilename = file => {
  const FILE_EXTENSION = path.extname(file.originalname);
  const FILE_BASENAME = path.basename(file.originalname, FILE_EXTENSION);
  const UNIQUE_SUFFIX = crypto.randomUUID();

  return `${FILE_BASENAME}-${UNIQUE_SUFFIX}`;
};

const upload = multer({ storage });

module.exports = upload;
