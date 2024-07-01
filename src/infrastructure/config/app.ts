import express from 'express'
import cors from 'cors'
import http from 'http'
import userRoutes from '../routes/userRoute'
import cookieParser from 'cookie-parser'
import adminRoutes from '../routes/adminRoute'
import vendorRoutes from '../routes/vendorRoute'
export const createServer = () =>{
    try {
        const app = express()
        app.use(express.json())
        app.use(express.urlencoded({extended:true}))
        app.use(cookieParser())
        app.use(cors({
                origin:'http://localhost:3000',
                methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
                credentials:true,
                optionsSuccessStatus:200}))
        app.use('/api/user',userRoutes)
        app.use('/api/admin',adminRoutes)
        app.use('/api/vendor',vendorRoutes)
        const server = http.createServer(app)
        return server;
    } catch (error) {
        console.log(error)
    }
}