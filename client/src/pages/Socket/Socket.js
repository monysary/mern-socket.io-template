import { useEffect, useState } from 'react'
import auth from "../../utils/auth";

// Import socket.io-client dependencies
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3000') // Change connection url to deployed link when deployed

function Socket() {
    const [chatInfo, setChatInfo] = useState({
        roomId: '',
        username: '',
        message: '',
    });

    const handleInputChange = ({ target: { name, value } }) => {
        setChatInfo({ ...chatInfo, [name]: value });
    };

    // Function to send chatInfo to server on the 'joinRoom' event
    const handleJoinRoom = (event) => {
        event.preventDefault();

        socket.emit('joinRoom', chatInfo)
    };

    useEffect(() => {
        socket.on('serverMessage', (data) => {
            console.log(data)
        });

    }, [socket])

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
                <h1>Socket Chat Room</h1>
                <hr />
                <form onSubmit={handleJoinRoom}>
                    <h3>Enter a chat room ID:</h3>
                    <input
                        name='roomId'
                        placeholder='Room Name'
                        value={chatInfo.roomId}
                        onChange={handleInputChange}
                    />
                    <h3>Enter your name:</h3>
                    <input
                        name='username'
                        placeholder='Name'
                        value={chatInfo.username}
                        onChange={handleInputChange}
                    />
                    <div style={{ marginTop: '20px' }}>
                        <button>Submit</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Socket;