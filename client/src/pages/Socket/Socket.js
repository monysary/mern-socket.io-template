import auth from "../../utils/auth";

// Import socket.io-client dependencies
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3000') // Change connection url to deployed link when deployed

function Socket() {
    

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
            </div>
        )
    }
}

export default Socket;