import {Server,Socket} from 'socket.io'


const userSocketMap:any = {}
let io:Server
export const getReceiverSocketId = (receiverId:any) =>{
    console.log("userSocketmap is",userSocketMap)
    return userSocketMap[receiverId]
}

function socketServer(server:any){

     io = new Server(server,{
        cors:{
           origin:["https://magic-moments-client.vercel.app"],
           methods:["GET","POST"]
        }
    });



    io.on('connection',(socket)=>{
        console.log("a user connected",socket.id)

        socket.emit('me',socket.id)

        const userId:string  = socket.handshake.query.userId as string ;
        if(userId && typeof userId === 'string'){
        userSocketMap[userId] = socket.id
        io.emit('getOnlineUsers',Object.keys(userSocketMap));
        }

        socket.on("callUser",(data)=>{
            console.log("heyyyyy reached in calluser in backend")
            console.log("data is",data)
            io.to(data.userToCall).emit('callUser',{signal:data.signalData,from:data.from,name:data.name})
        })

        socket.on("answerCall",(data)=>{
            console.log("dat is",data)
            console.log("reached her in backend to anser the call")
            io.to(data.to).emit("callAccepted",data.signal)
        })


    socket.on('disconnect',()=>{
        console.log("user disconnected",socket.id)
        delete userSocketMap[userId];
        io.emit('getOnlineUsers',Object.keys(userSocketMap))
    })
    })


}
export const getSocketServer = () => io
export default socketServer