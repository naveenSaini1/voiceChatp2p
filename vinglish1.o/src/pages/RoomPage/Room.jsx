import { useContext, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { RoomApi } from "../../contextapi/RoomApi";

const Room=()=>{

    const videRef=useRef([]);
    const {roomId}=useParams();
    const {streamArray,peersRef}=useContext(RoomApi)
    console.log(roomId);
    console.log(streamArray);
console.log("peersRef",peersRef)

    useEffect(()=>{
       // videRef?.current.srcObject=stream;
       streamArray.forEach((item, index) => {
        const videoElement = videRef.current[index];
        if (videoElement && item) {
            videoElement.srcObject = item.stream;
        }
    });

    },[streamArray])
    return (
        <div style={{display:"flex",width:"800px",flexDirection:"column",flexWrap:"wrap"}}>
        {streamArray.map((item, index) => (
          <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
            <p>{item.user}</p>
           <audio width={"200px"} key={index} ref={(el) => videRef.current[index] = el} controls autoPlay></audio>
          </div>
        ))}
      </div>
    )
}
export default Room;