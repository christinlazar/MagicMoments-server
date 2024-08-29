import 'reflect-metadata';
import {createServer} from './infrastructure/config/app'
import {connectDB} from './infrastructure/config/connectDB'
import dotenv from 'dotenv'
dotenv.config()
require('dotenv').config()


declare global {
    namespace Express {
      interface Request {
        file?: Express.Multer.File;
        files?: Express.Multer.File[];
      }
  
      namespace Multer {
        interface File {
          fieldname: string;
          originalname: string;
          encoding: string;
          mimetype: string;
          size: number;
          destination: string;
          filename: string;
          path: string;
          buffer: Buffer;
        }
      }
    }
  }

const startServer = async () => {
    try {

        await connectDB()
        const app = createServer();
        const PORT = 5000;
        app?.listen(PORT, () =>{
            console.log(`Connected to server,server running on ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}
startServer()
