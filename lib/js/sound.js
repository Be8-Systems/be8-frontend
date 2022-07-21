let messageReceivedTimer = null;

export default Object.freeze({ 
    messageReceived () {
        clearTimeout(messageReceivedTimer);
        
        messageReceivedTimer = setTimeout(() =>  {
            const audio = new Audio('assets/sounds/received.mp3').play();

            if (audio) {
                audio.catch(console.log);
            }
        }, 300);
    }
});