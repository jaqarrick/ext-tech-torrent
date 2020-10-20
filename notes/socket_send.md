# Send Function

```
socket.send(
    message, //this is the buffer
    0, //where the buffer begins
    message.length, // where the buffer ends
    url.port, //port of the receiver's url
    url.host, //host of the receiver's url
    () => {}
) //callback for when the message finsishes sending

socket.on("message", msg => {
    console.log(message)
})
```
