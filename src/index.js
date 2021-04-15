const express=require('express')
const socketio=require('socket.io')
const path=require('path')
const http=require('http')
const {generatemessage}=require('./utils/generatemessage')
const {addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users')
const { emit } = require('process')
const app=new express()

const publicDirectory=path.join(__dirname,'../public')
app.use(express.static(publicDirectory))
const server=http.createServer(app)
const io=socketio(server)
const port=process.env.PORT
const msg='Welcome'

io.on('connection',(socket)=>{

      
        socket.emit('message',generatemessage('System',msg))
        

        socket.on('Message',(msg)=>{
            const user=getUser(socket.id)
            io.to(user.room).emit('message',generatemessage(user.username,msg))
        })

        socket.on('SendLocation',(location,callback)=>{
            const user=getUser(socket.id)
            const loc=`https://google.com/maps?q=${location.latitude},${location.longitude} `
            io.to(user.room).emit('SendLocation',generatemessage(user.username,loc))
            callback()
        })

        socket.on('disconnect',()=>{
                const user=removeUser(socket.id)
                if(user)
                io.to(user.room).emit('message',generatemessage('System',`${user.username} has disconnected`))

                io.to(user.room).emit('roomdata',{
                room:user.room,
                user:getUsersInRoom(user.room)
            })
        })

        socket.on('join',({username,room},callback)=>{
            const {error,user}=addUser({id:socket.id,username,room})

            if(error)
            return callback(error)
            
            socket.join(user.room) 
            
            socket.broadcast.to(user.room).emit('message', generatemessage('System',`${user.username} has joined!`))
            io.to(user.room).emit('roomdata',{
                room:user.room,
                user:getUsersInRoom(user.room)
            })
            callback()

        })
})





server.listen(port,()=>{
    console.log(`Server is up and running at ${port}`)
})
