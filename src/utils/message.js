const generatemsg = (msg,username)=>{
    return{
        username,
        msg,
        createdAt:new Date().getTime()
    }
}
const generatelocation = (url,username)=>{
    return{
        username,
        url,
        createdAt:new Date().getTime()
    }
}

module.exports = {
    generatemsg,
    generatelocation,
}