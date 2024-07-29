import express from 'express'
import cors from 'cors'
import http from 'http'
import userRoutes from '../routes/userRoute'
import cookieParser from 'cookie-parser'
import adminRoutes from '../routes/adminRoute'
import vendorRoutes from '../routes/vendorRoute'
import chatRoutes from '../routes/chatRoutes'
import bodyParser from 'body-parser'
export const createServer = () =>{
    try {
        const app = express()
        app.use(express.json())
        app.use(express.urlencoded({extended:true}))
        app.use(bodyParser.json())
        app.use(cookieParser())
        app.use(cors({
                origin:'http://localhost:3000',
                methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
                credentials:true,
                optionsSuccessStatus:200}))
        app.use('/api/user',userRoutes)
        app.use('/api/admin',adminRoutes)
        app.use('/api/vendor',vendorRoutes)
        app.use('/api/chat',chatRoutes)
        const server = http.createServer(app)
        return server;
    } catch (error) {
        console.log(error)
    }
}