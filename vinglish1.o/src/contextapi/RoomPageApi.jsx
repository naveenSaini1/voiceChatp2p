import { createContext, useContext, useEffect, useState } from "react";
import { UserAuth } from "./UserAuth";

export const RoomPageApi = createContext();

 const RoomPageApiProvider = ({ children }) => {
    const [rooms, setRooms] = useState([]);
    const { socketConnection } = useContext(UserAuth);
    console.log(rooms);
    const handleCreateRoom=(roomName)=>{
        let object={
            roomName:roomName,
        }
        socketConnection.send("/app/createRoom",{},JSON.stringify(object));
    }

    useEffect(() => {
        let subscription_Chenal_1;
        if (socketConnection != null) {
           
            subscription_Chenal_1 = socketConnection.subscribe("/topic/createdRooms", (response) => {
                let result = JSON.parse(response.body);
                console.log("hello",result);
                setRooms((pre) => [...pre, result.roomName]);
            })
        }
        return () => {
            subscription_Chenal_1?.unsubscribe();
        }
    },[])

    return (
        <RoomPageApi.Provider value={{ rooms,handleCreateRoom }}>
            {children}
        </RoomPageApi.Provider>
    )
}
export default RoomPageApiProvider;