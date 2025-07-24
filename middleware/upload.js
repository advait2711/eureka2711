// middleware/upload.js

import multer from 'multer';


const storage = multer.memoryStorage();


const upload = multer({
    storage: storage,
    
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    // Optional: Limit file size (e.g., 5MB)
    limits: { fileSize: 5 * 1024 * 1024 }
});

export default upload;
