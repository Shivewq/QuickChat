const chatForm = document.getElementById('chat-form'); //Form ID from chat.html
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username & room from URL script
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom (with username & room displayed)
socket.emit('joinRoom', { username, room });

// Get room & users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// Message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // Scroll down on new message input
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Receive & submit the user's message
chatForm.addEventListener('submit', (e) => { // event parameter
    e.preventDefault(); // prevent default (send to file)

    const msg = e.target.elements.msg.value; // get message from text input

    // emit to Server
    socket.emit('chatMessage', msg); 

    // Clear message input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

// add room names to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}

document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you would like to leave the chatroom?');
    if (leaveRoom) {
        window.location = '../index.html'
    } else {
        
    }
})