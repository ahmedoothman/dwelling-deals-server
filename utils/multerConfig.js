const multer = require('multer');
const sharp = require('sharp');
const { initializeApp } = require('firebase/app');
const {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
} = require('firebase/storage');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Multer setup
const multerStorage = multer.memoryStorage(); // Save images as buffers
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(
            new AppError('Not an image! Please upload only images.', 400),
            false
        );
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

// Middleware to handle image uploads
exports.uploadHouseImages = upload.fields([
    { name: 'imageUrl', maxCount: 1 },
    { name: 'images', maxCount: 5 },
]);

// Resize and upload images
exports.resizeAndUploadImages = catchAsync(async (req, res, next) => {
    if (req.files['imageUrl']) {
        const imageBuffer = await sharp(req.files['imageUrl'][0].buffer)
            .resize(600, 500)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toBuffer();

        const metadata = {
            contentType: 'image/jpeg',
        };
        const imageUrlRef = ref(storage, `images/${Date.now()}-imageUrl.jpeg`);
        await uploadBytes(imageUrlRef, imageBuffer, metadata);
        req.body.imageUrl = await getDownloadURL(imageUrlRef);
    }

    if (req.files['images']) {
        req.body.images = await Promise.all(
            req.files['images'].map(async (file) => {
                const imageBuffer = await sharp(file.buffer)
                    .resize(600, 500)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toBuffer();

                const metadata = {
                    contentType: 'image/jpeg',
                };
                const imageRef = ref(
                    storage,
                    `images/${Date.now()}-${file.originalname}`
                );
                await uploadBytes(imageRef, imageBuffer, metadata);
                return await getDownloadURL(imageRef);
            })
        );
    }

    next();
});
