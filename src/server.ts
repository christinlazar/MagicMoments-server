import 'reflect-metadata';
import {createServer} from './infrastructure/config/app'
import {connectDB} from './infrastructure/config/connectDB'
import dotenv from 'dotenv'
dotenv.config()
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
