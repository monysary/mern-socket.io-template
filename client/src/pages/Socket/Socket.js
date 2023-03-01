import { useEffect, useState } from 'react'
import auth from "../../utils/auth";
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../../utils/queries';

// Import socket.io-client dependencies
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3000') // Change connection url to deployed link when deployed

function Socket() {
    const [chatInfo, setChatInfo] = useState({
        roomId: '',
        username: '',
        serverMessage: '',
        message: '',
    });

    const { loading, data } = useQuery(QUERY_ME);
    const name = data?.me.name || '';

    const handleInputChange = ({ target: { name, value } }) => {
        setChatInfo({ ...chatInfo, [name]: value });
    };

    // Function to send chatInfo to server on the 'joinRoom' event
    const handleJoinRoom = (event) => {
        event.preventDefault();

        if (chatInfo.roomId === '' || chatInfo.username === '') {
            alert('Please enter a chat room ID and your name!')
        } else {
            socket.emit('joinRoom', chatInfo)
        }
    };

    useEffect(() => {
        socket.on('serverMessage', (data) => {
            setChatInfo({ ...chatInfo, serverMessage: data })
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
                <h1>Hello {name}, welcome to the Socket Chat Room!</h1>
                <hr />
                <form onSubmit={handleJoinRoom} style={{ marginBottom: '20px' }}>
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
                <h4>{chatInfo.serverMessage}</h4>

            </div>
        )
    }
}

export default Socket;