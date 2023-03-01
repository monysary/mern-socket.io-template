import { useState } from 'react'
import auth from "../../utils/auth";

// Import socket.io-client dependencies
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3000') // Change connection url to deployed link when deployed

function Socket() {
    const [chatInfo, setChatInfo] = useState({
        roomId: '',
        username: '',
    });

    const handleInputChange = ({ target: { name, value } }) => {
        setChatInfo({ ...chatInfo, [name]: value });
    };

    const handleJoinRoom = (event) => {
        event.preventDefault();
        console.log(event.target[0].value);

        socket.emit('joinRoom', chatInfo.roomId)
    };
    
    const handleUsername = (event) => {
        event.preventDefault();
        console.log(event.target[0].value);


    };

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
                <h3>Enter a chat room ID:</h3>
                <form onSubmit={handleJoinRoom}>
                    <input
                        name='roomId'
                        placeholder='Room Name'
                        value={chatInfo.roomId}
                        onChange={handleInputChange}
                    />
                    <button >Submit</button>
                </form>
                <h3>Enter your name:</h3>
                <form onSubmit={handleUsername}>
                    <input
                        name='username'
                        placeholder='Name'
                        value={chatInfo.username}
                        onChange={handleInputChange}
                    />
                    <button>Submit</button>
                </form>
            </div>
        )
    }
}

export default Socket;