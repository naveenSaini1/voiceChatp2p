import { useContext, useEffect, useRef } from "react";
import { CallingApiContext } from "../../contextapi/CallingApi";

const ConnectedPage = () => {
    const { remoteStream } = useContext(CallingApiContext);
   
    const videoRef = useRef(null);

    useEffect(() => {
        if (remoteStream && videoRef.current) {
            videoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);
    return (
        <>
            <video ref={videoRef} controls autoPlay playsInline></video>
        </>
    );
}

export default ConnectedPage;
