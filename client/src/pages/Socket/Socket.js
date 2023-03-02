import { useEffect, useState } from 'react'
import auth from "../../utils/auth";
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../../utils/queries';

// Import socket.io-client dependencies
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3000') // Change connection url to deployed link when deployed

function Socket() {
    const [roomId, setRoomId] = useState('');
    const [userName, setUserName] = useState('');
    const [messageSent, setMessageSent] = useState('');
    const [messageReceived, setMessageReceived] = useState('');

    const { loading, data } = useQuery(QUERY_ME);
    const name = data?.me.name || '';

    const handleInputChange = ({ target: { name, value } }) => {
        switch (name) {
            case 'roomId':
                setRoomId(value)
                break;
            case 'userName':
                setUserName(value)
                break;
            case 'messageSent':
                setMessageSent(value)
                break;
            default:
                break;
        }
    };

    // Function to send chatInfo to server on the 'joinRoom' event
    const handleJoinRoom = (event) => {
        event.preventDefault();

        if (roomId === '' || userName === '') {
            alert('Please enter a chat room ID and your name!')
        } else {
            socket.emit('joinRoom', { roomId, userName })
        }
    };

    // Function for sending messages set on 'sendMessage' event
    const sendMessage = (event) => {
        event.preventDefault();

        if (!messageSent) {
            return;
        } else if (roomId === '') {
            alert('You need to enter a room!')
        } else {
            socket.emit('sendMessage', { roomId, messageSent })
        }

    };

    // On 'receiveMessage' event, sets messageReceived to data
    socket.on('receiveMessage', (data) => {
        setMessageReceived(data)
        setMessageSent('')

    })

    if (auth.tokenExpired()) {
        return (
            <div>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/login">Login</a></li>
                </ul>
                <h1>You need to be logged in</h1>
            </div>
        )
    } else {
        return (
            <div>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="#" onClick={() => auth.logout()}>Logout</a></li>
                </ul>
                <h1>Hello {name}, welcome to the Socket Chat Room!</h1>
                <hr />
                <form onSubmit={handleJoinRoom} style={{ marginBottom: '20px' }}>
                    <h4>Enter a chat room ID:</h4>
                    <input
                        name='roomId'
                        placeholder='Room Name'
                        value={roomId}
                        onChange={handleInputChange}
                    />
                    <h4>Enter your name:</h4>
                    <input
                        name='userName'
                        placeholder='Name'
                        value={userName}
                        onChange={handleInputChange}
                    />
                    <div style={{ marginTop: '20px' }}>
                        <button>Submit</button>
                    </div>
                </form>
                <h3>Send a message:</h3>
                <form onSubmit={sendMessage}>
                    <input
                        name='messageSent'
                        placeholder='Your Message'
                        value={messageSent}
                        onChange={handleInputChange}
                    />
                    <button>Send</button>
                </form>
                <h4>Message:</h4>
                <div>{messageReceived}</div>
            </div>
        )
    }
}

export default Socket;