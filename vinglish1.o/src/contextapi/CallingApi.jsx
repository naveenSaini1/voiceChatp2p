import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { UserAuth } from "./UserAuth";


export const CallingApiContext = createContext();

const CallingApiContextProvider = ({ children }) => {
    const { user, socketConnection } = useContext(UserAuth);
    const [peerConnectionState, setPeerConnectionState] = useState(null);
    const [onCall, setOnCall] = useState(false);
    const [remoteStream, setRemoteStream] = useState();
    const mystreamRef = useRef();
    const [isCallLoading, setIsCallLoading] = useState(false);
    const handleDownloadStream=useCallback(()=>{
         console.log("hello",mystreamRef.current);
         const mediaStream=new MediaRecorder(mystreamRef.current);
         mediaStream.ondataavailable=(event)=>{
            console.log(event.data);
            const formData = new FormData();
            formData.append('file', event.data);
           formData.append('name', user.email);


            fetch('http://localhost:8080/upload', {
            method: 'POST',
            body: formData
            })
            .then(response => {
            // Handle response from server
            })
            .catch(error => {
                console.log(error);
            // Handle errors
            });

         }
         mediaStream.start(10000);
    },[])

    const handledStopRecoding=useCallback(()=>{
        const formData=new FormData();
        formData.append("name",user.email)
        fetch(`http://localhost:8080/stopRecoding`,{
            method:"POST",
            body:formData
        })
        .then(()=>{

        })
        .catch((error)=>{
            console.log("line: 50 ",error);
        })
    },[])
    useEffect(() => {
        const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
        const peerConnection = new RTCPeerConnection(configuration);
        peerConnection.onconnectionstatechange= event => {
            console.log(peerConnection.connectionState,"state ========================");
            if (peerConnection.connectionState === 'disconnected') {
                setOnCall((pre)=>!pre)
                handleToOfMyNavigatore();
            }
            else if(peerConnection.connectionState === 'connected'){
                setIsCallLoading((pre) => !pre);
                setOnCall((pre) => !pre)
                handleDownloadStream();
               
            }
        };
        setPeerConnectionState(peerConnection);
        return () => {
            if (peerConnection) {
                console.log("current ref", mystreamRef.current);
                handleToOfMyNavigatore();
                handledStopRecoding();
                peerConnection.close();
            }
        }
    }, [])


    useEffect(() => {
        let subscription_Chenal_2
        if (socketConnection != null && socketConnection != undefined && peerConnectionState != null) {
            subscription_Chenal_2 = socketConnection.subscribe(`/topic/call/${user.email}`, async (response) => {
                let reslut = JSON.parse(response.body);
                console.log("result", reslut)
                switch (reslut.type) {
                    case "call":
                        if (user.email == reslut.callerId) {

                            handleCreateOffer(reslut, peerConnectionState);
                        }

                        break;
                    case "offer":
                        peerConnectionState.onicecandidate = (event) => {
                            if (event.candidate) {
                                let object = {
                                    callerId: user.email,
                                    receiverId: reslut.callerId,
                                    activeUser: reslut.callerId,
                                    type: "iceCandidate",
                                    data: event.candidate
                                }
                                socketConnection.send("/app/call", {}, JSON.stringify(object));

                            }
                        }
                        peerConnectionState.setRemoteDescription(new RTCSessionDescription(reslut.data))
                        const answer = await peerConnectionState.createAnswer();
                        await peerConnectionState.setLocalDescription(answer);
                        let object = {
                            callerId: user.email,
                            receiverId: reslut.callerId,
                            activeUser: reslut.callerId,
                            type: "answer",
                            data: answer
                        }
                        socketConnection.send("/app/call", {}, JSON.stringify(object));
                        break;
                    case "answer":
                        const remoteDesc = new RTCSessionDescription(reslut.data);
                        await peerConnectionState.setRemoteDescription(remoteDesc);

                        break;
                    case "iceCandidate":
                        await peerConnectionState.addIceCandidate(reslut.data);
                        break;
                    default:
                        break;
                }
            })


        }

        return () => {

            subscription_Chenal_2?.unsubscribe();
            

        }

    }, [peerConnectionState])

    const handleToOfMyNavigatore=()=>{
        mystreamRef.current?.getTracks().forEach(function (track) {
            track.stop();
        });
    }

    const handleCreateOffer = async (reslut) => {
        console.log("peer state ", peerConnectionState)
        peerConnectionState.onicecandidate = (event) => {
            if (event.candidate) {
                let object = {
                    callerId: user.email,
                    receiverId: reslut.receiverId,
                    activeUser: reslut.receiverId,
                    type: "iceCandidate",
                    data: event.candidate
                }
                socketConnection.send("/app/call", {}, JSON.stringify(object));

            }
        }
        let offer = await peerConnectionState.createOffer();
        await peerConnectionState.setLocalDescription(offer);
        let object = {
            callerId: user.email,
            receiverId: reslut.receiverId,
            activeUser: reslut.receiverId,
            type: "offer",
            data: offer
        }
        socketConnection.send("/app/call", {}, JSON.stringify(object));



    }
    async function handleCall() {
        setIsCallLoading((pre) => !pre);
        const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
        let track = stream.getTracks()
        peerConnectionState.addTrack(track[0], stream)

        peerConnectionState.ontrack = (event) => {
            const [remoteStream] = event.streams;
           
            setRemoteStream(remoteStream);

        };
        let object = {
            email: user.email,
            password: user.password,
            type: "call"

        }
        console.log(peerConnectionState);
        socketConnection.send("/app/makeCall", {}, JSON.stringify(object));
        mystreamRef.current = stream;

    }

    return (
        <CallingApiContext.Provider value={{ handleCall, onCall, isCallLoading, remoteStream }}>
            {children}
        </CallingApiContext.Provider>
    )
}
export default CallingApiContextProvider;