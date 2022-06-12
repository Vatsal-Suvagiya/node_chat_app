const express = require('express')
const app = express()
const http = require('http')
const socketio = require('socket.io')
const path = require('path')
const Filter = require('bad-words')
const server = http.createServer(app)
const io = socketio(server)
const {generateMessage,generateLocMessage} = require('./src/utils/messages')
app.use(express.static('./public'))
// const publicDIRECT = path.join(__dirname,'../public')
// app.use(express.static(publicDIRECT))

// let count=0 

io.on('connection',(socket)=>{
    console.log('new connection astablished..');

    socket.emit('welcome','welcome!!boyZ!!')

    // socket.emit('welcome',generateMessage('welcome boyz!!'))
    // socket.broadcast.emit('welcome',generateMessage('joined!'))

    
    // socket.emit('countUpdated',count)

    // socket.on('increment',()=>{ 
    //     count++
    //     io.emit('countUpdated',count)
    // })
    socket.on('join',({username, room})=>{
        socket.join(room)
      
        socket.emit('welcome',generateMessage('welcome boyz!!'))
        socket.broadcast.to(room).emit('welcome',generateMessage(`${username} has joined`))
    })
    socket.on('sendmessage',(message,callback)=>{
        const filter = new Filter()

        if(filter.isProfane(message))
        {
            return callback('profinity is not allowed!!sssss')
        }
        
        io.to('sd').emit('welcome',generateMessage(message))
        callback()
    })
    socket.on('sendlocation' , (coords,callback)=>{
        io.emit('location', generateLocMessage(`http://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
    socket.on('disconnect', ()=>{
        io.emit('message' , generateMessage('user has left!!'))
    })
})

const port = process.env.PORT || 3000
server.listen(port,()=>{
    console.log(`listening on port no ${port}`);
}) 