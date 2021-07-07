const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {isRealString} = require('./utils/validater')
const {generatemsg,generatelocation} = require('./utils/message')
const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users')
const app = express()

const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const publicDirectory = path.join(__dirname,'../public')

app.use(express.static(publicDirectory))



io.on('connection',(socket)=>{
    console.log('new Web socket connection')
    
    /*socket.emit('countupdated',count)
    socket.on('increment',()=>{
        count++;
        io.emit('countupdated',count)
        
    })*/
    socket.on('join',({username,room},callback)=>{
      const {error,user} = addUser({id:socket.id,username:username,room:room})
      console.log(user)
      if(error){
          return callback(error)
      }
        socket.join(user.room)
        socket.emit('message',generatemsg('Welcome!',' '))
        socket.broadcast.to(user.room).emit('message',generatemsg(user.username+' '+'is joined',' '))
        io.to(user.room).emit('roomdata',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        
        callback()
    })
    socket.on('sendmsg',(message,callback)=>{
        const user = getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('profane is not allowed')
        }
        if(user && isRealString(message)){
        io.to(user.room).emit('message',generatemsg(message,user.username))}
        callback()
    })
    socket.on('sendlocation',(coords,callback)=>{
        const user = getUser(socket.id)
      io.to(user.room).emit('locationmsg',generatelocation('https://www.google.com/maps/?q='+coords.latitude+','+coords.longitude,user.username))
      callback('Location shared')
    })
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        if(user){
        io.to(user.room).emit('message',generatemsg(user.username+' '+'is Left',' '))

        io.to(user.room).emit('roomdata',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
    }
    })
})

server.listen(port,()=>{
    console.log("server is up to running")
})

