const users = []

const addUser =(({id,username,room})=>{
  username = username.trim()
  room = room.trim()

  if(!username || !room){
      return {
          error : "Username and Room is required"
      }
  }

  const existinguser = users.find((user)=>{
   return (user.username===username && user.room===room)
     
  })

  if(existinguser){
      return{
          error :"Username is already exist"
      }
  }
   

  const user = {id,username,room}
  users.push(user)
  return {user}
})

const removeUser = (id)=>{
    const index = users.findIndex((user)=>user.id===id)
    console.log(index)
    if(index!==-1){
        return users.splice(index,1)[0]
    }
    
}

const getUser = (id) =>{
   return users.find((user)=>user.id===id)
}
const getUsersInRoom = (room) =>{
    room=room.trim()
    return users.filter((user)=>user.room===room)
}

///const user=addUser({id:12,username:'harsh',room:'room'})
//const userss=addUser({id:13,username:'harsh',room:'room'})
//const remove = removeUser(12)
//console.log(user)
//console.log(userss)
//console.log(remove)
//console.log(user)
module.exports ={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}