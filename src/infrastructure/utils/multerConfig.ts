// const multer = require('multer')
// const {CloudinaryStorage} = require('multer-storage-cloudinary')
// const cloudinary = require('./cloudinary')

import multer from 'multer'
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import cloudinary from './cloudinary';

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        // folder:'wedding_photographs',
        // format:async(req:Express.Request,file:Express.Multer.File) => 'jpg' || 'png'
    },
});

const upload = multer({storage:storage});
export default upload