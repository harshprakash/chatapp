const socket=io()

const $messageForm = document.querySelector('#form')
const $messageFormInput=$messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationFormButton =document.querySelector('#location')
const $message = document.querySelector('#messages')
const $user = document.querySelector('#sidebar')


const messagetemplate = document.querySelector('#message-template').innerHTML
const locationtemplate = document.querySelector('#location-template').innerHTML
const usertemplate = document.querySelector('#user-template').innerHTML

const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoScroll = () =>{
  const $newmessage = $message.lastElementChild
  //height of the new msg
  const newmsgstyle = getComputedStyle($newmessage)
  const newmargin = parseInt(newmsgstyle.marginBottom)
  const newmsgheight = $newmessage.offsetHeight+newmargin

  const visibleheight = $message.offsetHeight

  const containerHeight = $message.scrollHeight

  const scrollHeight = $message.scrollTop + visibleheight

  if(containerHeight-newmsgheight<=scrollHeight){
  $message.scrollTop = $message.scrollHeight    
  }
}
socket.on('message',(message)=>{
  console.log(message)
  const html =Mustache.render(messagetemplate,{
      message:message.msg,
      username:message.username,
      createdAt:moment(message.createdAt).format('h:mm a')
  })
  $message.insertAdjacentHTML('beforeend',html)
  autoScroll()
})
socket.on('locationmsg',(message)=>{
    console.log(message)
    const html =Mustache.render(locationtemplate,{
        url:message.url,
        username:message.username,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $message.insertAdjacentHTML('beforeend',html)
    autoScroll()
  })
/*document.querySelector('#increment').addEventListener('click',()=>{
    console.log('clicked')
    socket.emit('increment')
})*/

$messageForm.addEventListener('submit',(e)=>{
e.preventDefault()
//const msg = document.querySelector('input').value
$messageFormButton.setAttribute('disabled','disabled')
const msg = e.target.elements.message.value

socket.emit('sendmsg',msg,(error)=>{
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value=''
    $messageFormInput.focus()
    if(error){
        console.log(error)
    }
    else{
        console.log('deliverd')
    }
    autoScroll()
})
})
$locationFormButton.addEventListener('click',()=>{
    
 if(!navigator.geolocation){
     return alert('geolocation not supported in your browser')
 }
 $locationFormButton.setAttribute('disabled','disabled')
 navigator.geolocation.getCurrentPosition((position)=>{
    //console.log(position.coords.latitude)
    
     socket.emit('sendlocation',{
         latitude:position.coords.latitude,
         longitude:position.coords.longitude,
         
     },(msg)=>{
        $locationFormButton.removeAttribute('disabled')
         //console.log(msg)
     })
     
     
 })
})
socket.on('roomdata',({room,users})=>{
    console.log(room,username)
    const html = Mustache.render(usertemplate,{
      room,
      users
    })
    $user.innerHTML=html

    //console.log(room)
    //console.log(username)
})
console.log(username,room)
socket.emit('join',{username,room},(error)=>{
   if(error){
       alert(error)
       location.href='/'
   }

})

