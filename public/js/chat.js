const newSoc=io()
const $form=document.querySelector("#form1")
const $message=document.querySelector("#message")
const $forminput=document.querySelector("#form1ip")
const $formb1=document.querySelector("#formb1")
const $formb2=document.querySelector("#formb2")
const $siderbar=document.querySelector("#ulists")

const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})

autoScroll=()=>{

    const msg=$message.lastElementChild

   const msgstyle=getComputedStyle(msg)

    const msgmargin=parseInt(msgstyle.marginBottom)
    const newmsgheight=msg.offsetHeight+msgmargin

    const visibleheight =msg.offsetHeight

    const containerheight =msg.scrollHeight

    const scrolloffset=msg.scrollTop +visibleheight

    if(containerheight-newmsgheight<=scrolloffset)
        $message.scrollTop=$message.scrollHeight
        
        console.log(containerheight)
        console.log(newmsgheight)
        console.log(scrolloffset)
        console.log(containerheight-newmsgheight<=scrolloffset)
        console.log($message.scrollTop)
        console.log($message.scrollHeight)
    
        // 44
        // chat.js:30 60
        // chat.js:31 0
        // chat.js:32 true
        // chat.js:33 0
        // chat.js:34 44
        // chat.js:35 60
        // chat.js:36 16px

    console.log(newmsgheight)
    console.log(msgstyle.marginBottom)
}

newSoc.on('message',(msg)=>{
    //templates for message
const time=moment(msg.createdAt).format('h:mm a')
const message=`<div  class='message'>
                    <p> <span class='message__name'>${msg.username}  </span>
                        <span class='message__meta'> ${time} </span>
                    </p>
                    <p>${msg.text} </p>
                </div>`

    $message.insertAdjacentHTML('beforeend',message)
    autoScroll()

})

newSoc.on('SendLocation',(loc)=>{
    //template for loc
const time=moment(loc.createdAt).format('h:mm a')
    const location=`<div  class='message'>
                    <p> <span class='message__name'>${loc.username} </span>
                        <span class='message__meta'>${time} </span>
                    </p>
                    <p><a href="${loc.text}" target="_blank"/>${loc.text} </p>
                </div>`
        $message.insertAdjacentHTML('beforeend',location)
        autoScroll()
})

newSoc.on('roomdata',({room,user})=>{
    //template for userslist
    const userlist=user.map((x)=>{
            return `<li> ${x.username} </li>`
    }).toString().replace(',','')
    
    const list=`<h2 class="room-title">${room} </h2>
                <h3 class="list-title">Users List</h3>
                <ul class="users">
                    ${userlist}
                </ul>`
    $siderbar.innerHTML=list
    
})

$form.addEventListener('submit',(e)=>{
    e.preventDefault()

    $formb1.setAttribute('disabled','disabled')    

    newSoc.emit('Message',$forminput.value)
    $forminput.value=''
    $forminput.focus()

    $formb1.removeAttribute('disabled')
})

$formb2.addEventListener('click',()=>{
    $formb2.setAttribute('disabled','disabled')
        if(!navigator.geolocation)    
        return alert('Sorry Your browser Does not support Geo Location')
       
        navigator.geolocation.getCurrentPosition((loc)=>{
           
            newSoc.emit('SendLocation',{
                latitude:loc.coords.latitude,
                longitude:loc.coords.longitude},() => {
              
                console.log('Location shared!')  
          })

        })
     $formb2.removeAttribute('disabled')

})

if(room)
{
    newSoc.emit('join',{username,room},(e)=>{
    if(e)
    { alert(e)
        location.href='/'
    }
})
}