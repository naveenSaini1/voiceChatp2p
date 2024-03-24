import { createContext, useEffect, useState } from "react";
import SockJS from "sockjs-client/dist/sockjs";
import Stomp from "stompjs";

export const UserAuth = createContext();


function UserAuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [activeCall, setActiveCall] = useState(false);
    const [socketConnection,setSocketConnection]=useState(null);



    useEffect(() => {
        if (user != null) {
            const socket = new SockJS('https://api.nmovies.xyz/wss');
            const stomp = Stomp.over(socket);
            stomp.connect({}, () => {
                console.log('WebSocket connected');
                setSocketConnection(stomp);
            });
            
        }
    }, [user])

    const handleSetActiveCall = () => {
        setActiveCall(!activeCall);
    }

    const handleLogin = (email, password) => {
        let object = {
            email,
            password
        }
        setUser(object);



    }


    return (
        <UserAuth.Provider value={{ user, handleLogin, handleSetActiveCall,socketConnection }}>
            {children}
        </UserAuth.Provider>
    )
}

export default UserAuthProvider;