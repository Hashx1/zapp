const users=[]

const addUser=({id,username,room})=>{
     
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    
    //No username
       
        if(!username||!room)
        return {error :'Either username or roomname is missing'}
    //Existing user
        const existingUser=users.find((user)=>{
            return user.username==username && user.room==room
        })
        if(existingUser)
        return {error:'Error username already in use'}

    //add user
        const user={id,username,room}
        users.push(user)    
        return {user}
}

const removeUser=(id)=>{
    const index=users.findIndex(user=>{ return user.id==id } )
    if(index!=-1)
    return users.splice(index,1)[0]
    
    return {error:"Index Does not exist"}
    
}

const getUser=(id)=>{
    const user=users.find((user)=>{return user.id==id})
    return user
}

const getUsersInRoom=(room)=>{
    return users.filter((user)=>{return user.room==room })
    

}

module.exports={
    getUser,
    getUsersInRoom,
    addUser,
    removeUser
}

