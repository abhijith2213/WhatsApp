const io = require('socket.io')(8800, {
    path:'/socket/socket.io',
    cors:{
        origin:"http://localhost:3000"
    }
})

let activeUsers = []

io.on("connection", (socket) =>{

        //add new user
        socket.on('new-user-add', (newUserId)=> {
            console.log(newUserId,'userid');
            // if no user in active list
            if(!activeUsers.some((user)=> user.userId === newUserId))
                {
                    activeUsers.push({
                        userId: newUserId,
                        socketId: socket.id
                    })
                }
                io.emit('get-users', activeUsers)
                console.log(activeUsers,'activeUsers');
        })

        //send Message

        socket.on('send-message',(data)=>{
            const {recieverId} = data
            const user = activeUsers.find((user)=>user.userId === recieverId)
            if(user){
                io.to(user.socketId).emit('recieve-message',data)
            }
        })

        //show user Typing
        socket.on('typing',(data)=>{
            console.log(data,'typing dataaaa');
            const {recieverId, senderId} = data
            const user = activeUsers.find((user)=>user.userId === recieverId)
            if(user){
                io.to(user.socketId).emit('user-typing',senderId)
            }
        })

        //Stopped typing
        socket.on('stop-typing',(data)=>{
            const {recieverId,senderId} = data
            const user = activeUsers.find((user)=>user.userId === recieverId)
            if(user){
                io.to(user.socketId).emit('user-stopped-typing',senderId)
            }
        })

        //Read MEssage Update
        socket.on('message-read',(data)=>{
            const {senderId} = data
            const user = activeUsers.find((user)=>user.userId === senderId)
            if(user){
                io.to(user.socketId).emit('change-messageStatus',data)
            }
        })

        socket.on('chat-open',(data)=>{
            const {chat,user} = data;
            const reciever = chat?.members.find((member)=>member !== user)
            const activeUser = activeUsers.find((user)=>user.userId === reciever)
            if(activeUser){
                io.to(activeUser.socketId).emit('change-messageStatus')
            }
        })

        //handle Logout
        socket.on('logout',()=>{
            console.log('calleddd logout');
            activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
            console.log("user disconnected",activeUsers);
            io.emit('get-users', activeUsers)        })

        //User Disconnect
        socket.on("disconnect", ()=> {
            activeUsers = activeUsers.filter((user) => user.socketId !== socket.id)
            console.log("user disconnected",activeUsers);
            io.emit('get-users', activeUsers)
        })
})