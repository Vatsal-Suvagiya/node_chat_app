const socket = io()
const $messageForm = document.querySelector('#messagefrom')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $message = document.querySelector('#messages')

const messagetemplate = document.querySelector("#message-template").innerHTML
const locationtemplate = document.querySelector("#loctiontemplate").innerHTML
// socket.on('countUpdated',(count)=>{
//     console.log('count has been updated!!', count );
// })
const {username , room}=Qs.parse(location.search, { ignoreQueryPrefix : true})

socket.on('welcome',(oy)=>{
    console.log(oy );
    const html = Mustache.render(messagetemplate,{
        message : oy.text,
        createdAt : moment(oy.createdAt).format('h:mm a')
    })
    $message.insertAdjacentHTML('beforeend', html)
})
socket.on('location',(location)=>{
    // console.log(location);
    const html =Mustache.render(locationtemplate , {
        location : location.url,
        createdAt : moment(location.createdAt).format('h:mm a') 
    })
    $message.insertAdjacentHTML('beforeend',html )
})
// document.querySelector('#i').addEventListener('click',()=>{
//     console.log('clicked!!');
//     socket.emit('increment')
// })s
document.querySelector('#messagefrom').addEventListener('submit',(e)=>{
    e.preventDefault()

    $messageFormButton.setAttribute('disabled','disabled')

    const message = document.querySelector('input').value

    socket.emit('sendmessage',message, (error)=> {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value= '' 
        $messageFormInput.focus()



        if(error){
            return console.log(error);
        }
        console.log('message delivered!!');
    })
})

$sendLocationButton.addEventListener('click',()=>{
    if(!navigator.geolocation)
    {
        return alert('geolocation is not support by your browser!!')
    }

    $sendLocationButton.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
            console.log(position);
            socket.emit('sendlocation' , {
                latitude : position.coords.latitude,
                longitude : position.coords.longitude
            },()=>{
                $sendLocationButton.removeAttribute('disabled')
                console.log('location shared!!');
            })
    })
})  

socket.emit('join', {username, room})