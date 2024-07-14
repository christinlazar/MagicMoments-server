const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
import cloudinary from './cloudinary'; // Assuming cloudinary.js is configured

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    resource_type: 'auto', // Automatically detect video or image
    folder: 'wedding_photographs', // Optional folder for organization
    allowed_formats: ['jpg', 'jpeg', 'png', 'mp4', 'mov', 'avi', 'mkv'],
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req: any, file: any, cb: (arg0: Error | null, arg1: boolean | undefined) => void) => {
    // Check allowed extensions using a more reliable method (e.g., mime-types module)
    const isAllowed = ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'].includes(file.mimetype);
    if (!isAllowed) {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false);
      return; // Explicitly return to prevent further processing
    }
    cb(null, true);
  },
  limits: { fileSize: Infinity }, // Optional: Set a maximum file size (50MB)
});

export default upload;
