import { useContext, createContext, useEffect, useState, useRef } from "react";
import { UserAuth } from "./UserAuth";
import { useParams } from "react-router-dom";



export const RoomApi = createContext();
let configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] }
const RoomApiProvider = ({ children }) => {
    const { user, socketConnection } = useContext(UserAuth);
    const [peerConnectionState, setPeerConnectionState] = useState();
    const [streamArray, setStreamArray] = useState([]);
    const { roomId } = useParams();
    const peersRef = useRef([]);
    function handleFirstPeer() {
        let object = {
            callerId: user.email,
            roomName: roomId,
            type: "join"
        }
        socketConnection.send("/app/room/join", {}, JSON.stringify(object))
    }
    useEffect(() => {
        //alert("hello")
        handleFirstPeer();
    }, [])

    useEffect(() => {
        let subscription_Chenal_1 = null;
        let subscription_Chenal_2 = null;


        if (user != null && socketConnection != null) {

            subscription_Chenal_1 = socketConnection.subscribe("/topic/room/" + roomId, async (response) => {
                let result = JSON.parse(response.body);
                switch (result.type) {
                    case "join":
                        {
                            if (user.email != result.callerId) {
                                handleCallAndCreateOffer(result);;
                            }
                            break;
                        }
                    default:
                        break;
                }
            })
            subscription_Chenal_2 = socketConnection.subscribe("/topic/room/user/" + user.email, async (response) => {
                let result = JSON.parse(response.body);
                console.log(result);

                switch (result.type) {
                    case "offer":
                        const peerConnection = new RTCPeerConnection(configuration);
                        let stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
                        let track = stream.getTracks()
                        console.log("tracksssssssss last person", track, stream);

                        peerConnection.addTrack(track[0], stream);
                        peerConnection.ontrack = (event) => {
                            const [remoteStream] = event.streams;
                            // alert("alert")
                            setStreamArray((pre) => [...pre,  {user:result.callerId,stream:remoteStream}]);
                            console.log("on track event =====>", remoteStream);
                        };
                        peerConnection.onicecandidate = (event) => {
                            if (event.candidate) {
                                let object = {
                                    callerId: user.email,
                                    receiverId: result.callerId,
                                    activeUser: result.callerId,
                                    type: "iceCandidate",
                                    data: event.candidate
                                }
                                socketConnection.send("/app/room/user", {}, JSON.stringify(object));

                            }
                        }
                        peerConnection.setRemoteDescription(new RTCSessionDescription(result.data))
                        const answer = await peerConnection.createAnswer();
                        await peerConnection.setLocalDescription(answer);
                        let object = {
                            callerId: user.email,
                            receiverId: result.callerId,
                            activeUser: result.callerId,
                            type: "answer",
                            data: answer
                        }
                        socketConnection.send("/app/room/user", {}, JSON.stringify(object));
                        let ob = {
                            name: result.callerId,
                            line: "89",
                            connection: peerConnection
                        }
                        peersRef.current.push(ob)
                        setPeerConnectionState(peerConnection);
                        break;
                    case "answer":
                        const remoteDesc = new RTCSessionDescription(result.data);
                        await peerConnectionState.setRemoteDescription(remoteDesc);

                        break;
                    case "iceCandidate":
                        await peerConnectionState.addIceCandidate(result.data);
                        break;
                    default:
                        break;


                }
            })
        }
        return () => {
            subscription_Chenal_1?.unsubscribe();
            subscription_Chenal_2?.unsubscribe();
            // peersRef.current?.forEach(peer => {
            //     peer.connection.close();
            // });
            // if (streamArray.length > 0) {
            //     streamArray.forEach(stream => {
            //         stream.getTracks().forEach(track => {
            //             track.stop();
            //         });
            //     });
            // }

        }
    }, [peerConnectionState])

    const handleCallAndCreateOffer = async (result) => {
        const peerConnection = new RTCPeerConnection(configuration);
        let stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })
        let track = stream.getTracks()
        console.log("tracksssssssss first line 110 person", stream);

        peerConnection.addTrack(track[0], stream)
        peerConnection.ontrack = (event) => {
            const [remoteStream] = event.streams;
            // alert("alert")
            setStreamArray((pre) => [...pre,  {user:result.callerId,stream:remoteStream}]);
            console.log("on track event =====>", remoteStream);
        };
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                let object = {
                    callerId: user.email,
                    receiverId: result.callerId,
                    type: "iceCandidate",
                    activeUser: result.callerId,
                    data: event.candidate
                }
                socketConnection.send("/app/room/user", {}, JSON.stringify(object));
            }
        }

        let offer = await peerConnection.createOffer();
        peerConnection.setLocalDescription(offer);
        let object = {
            callerId: user.email,
            receiverId: result.callerId,
            activeUser: result.callerId,
            type: "offer",
            data: offer
        }

        socketConnection.send("/app/room/user", {}, JSON.stringify(object));
        let ob = {
            name: result.callerId,
            line: "151",
            connection: peerConnection

        }
        peersRef.current.push(ob)
        setPeerConnectionState(peerConnection);

    }
    return (
        <RoomApi.Provider value={{ streamArray, peersRef }}>
            {children}
        </RoomApi.Provider>
    )
}
export default RoomApiProvider;