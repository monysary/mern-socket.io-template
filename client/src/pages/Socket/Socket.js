import auth from "../../utils/auth";

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