import { Link, useNavigate } from "react-router-dom";
import styles from "./RoomPage.module.css"
import { useContext, useRef, useState } from "react";
import {RoomPageApi} from "../../contextapi/RoomPageApi";
const RoomPage=()=>{
    const inputRef=useRef();
    const [popup,setPopup]=useState(false);
    const {rooms,handleCreateRoom}=useContext(RoomPageApi);
    const navigate=useNavigate();
    const onRoomPage=()=>{
        handleCreateRoom(inputRef.current.value)
        //navigate(inputRef.current.value)
        setPopup((pre)=>!pre)
        
    }

    return (
        <div className={styles.roomPageMainContainer}>
        <div>
            <button className={styles.createButton} onClick={()=>{setPopup((pre)=>!pre)}}>Create Room</button>
        </div>
        <div className={styles.roomContainer}>
            <p className={styles.roomTitle}>Your Room</p>
        </div>
        <div className={styles.roomContainer}>
            <p className={styles.roomTitle}>Active Room</p>
            <div style={{padding:"20px"}}>
                {rooms.map((item)=>{

                  return  <div onClick={()=>navigate(item)} style={{border:"2px solid black",width:"200px",height:"100px",display:"flex",justifyContent:"center",alignItems:"center",boxShadow:"rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;"}}> 
                    <p><span style={{color:"orange",fontWeight:"bolder"}}>room Name</span>: {item}</p>
                </div>
                })}
                
            </div>
        </div>
        <div className={styles.roomContainer}>
            <p className={styles.roomTitle}>Future Rooms</p>
        </div>
    {popup && 
     <div className={styles.createRoomPopup}>
     <div className={styles.createRoomCloseUp} onClick={()=>{setPopup((pre)=>!pre)}}>X</div>
     <div>
         <input ref={inputRef} type="text" placeholder="Name of the room" />
         <input type="text" placeholder="Enter tags" />
         <button onClick={onRoomPage}>Create room</button>
     </div>

 </div>
    }
       
        </div>
    )


}
export default RoomPage;