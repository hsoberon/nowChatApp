import React, { useState, useEffect, useRef } from "react"
// import useWebSocket from "react-use-websocket";
import io from "socket.io-client";
import {Button} from 'react-bootstrap';

const pc_config = {
	iceServers: [
	  // {
	  //   urls: 'stun:[STUN_IP]:[PORT]',
	  //   'credentials': '[YOR CREDENTIALS]',
	  //   'username': '[USERNAME]'
	  // },
	  {
		urls: "stun:stun.l.google.com:19302",
	  },
	],
  };
  

function Video() {
    const baseUrl                       = 'ws://localhost:5000';
	const [ me, setMe ] = useState("")
	const [ user, setUser ] = useState("")
    const [ enableCamera, setEnableCamera ] = useState(false)
	const [ enableConnections, setEnableConnections ] = useState(false)
	const myStream = useRef();
	const socketRef = useRef();
  	const pcRef = useRef();
	const myVideo = useRef()
	const userVideo = useRef()

	  useEffect(() => {
		socketRef.current = io.connect(baseUrl);
		pcRef.current = new RTCPeerConnection(pc_config);
	
		socketRef.current.on("me", (socketID) => {
			if (socketID) {
			  setMe(socketID)
			}
		  });

		socketRef.current.on("all_users", (allUsers) => {
		  if (allUsers.length > 0) {
			createOffer();
		  }
		});
	
		socketRef.current.on("getOffer", (sdp) => {
		  console.log(sdp);
		  console.log("get offer");
		  createAnswer(sdp);
		});
	
		socketRef.current.on("getAnswer", (sdp) => {
		  console.log("get answer");
		  if (!pcRef.current) return;
		  pcRef.current.setRemoteDescription(sdp);
		  console.log(sdp);
		});
	
		socketRef.current.on("getCandidate", async (candidate) => {
			if (!pcRef.current) return;
			await pcRef.current.addIceCandidate(candidate);
				console.log("candidate add success");
			}
		);
	
		return () => {
		  if (socketRef.current) {
			socketRef.current.disconnect();
		  }
		  if (pcRef.current) {
			pcRef.current.close();
		  }
		};
	  }, []);

	  const createOffer = async () => {
		console.log("create offer");
		if (!(pcRef.current && socketRef.current)) return;
		try {
		  const sdp = await pcRef.current.createOffer({
			offerToReceiveAudio: true,
			offerToReceiveVideo: true,
		  });
		  await pcRef.current.setLocalDescription(new RTCSessionDescription(sdp));
		  socketRef.current.emit("offer", sdp);
		} catch (e) {
		  console.error(e);
		}
	  };

	  const createAnswer = async (sdp) => {
		if (!(pcRef.current && socketRef.current)) return;
		try {
		  await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
		  console.log("answer set remote description success");
		  const mySdp = await pcRef.current.createAnswer({
			offerToReceiveVideo: true,
			offerToReceiveAudio: true,
		  });

		  console.log("create answer");
		  await pcRef.current.setLocalDescription(new RTCSessionDescription(mySdp));
		  socketRef.current.emit("answer", mySdp);
		} catch (e) {
		  console.error(e);
		}
	  };
	

    const connected = () => {
        setEnableCamera(true);

		
		navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true,
		}).then((stream) => {
			console.log('Start video');

			myStream.current = stream

			if (myVideo.current) myVideo.current.srcObject = stream;

			if (!(pcRef.current && socketRef.current)) return;

			stream.getTracks().forEach((track) => {
				if (!pcRef.current) return;
				pcRef.current.addTrack(track, stream);
			});

			
		}).catch ((e) => {
			console.error(e);
		});

		
    }

	useEffect(() => {
		if(enableConnections){
			const stream = myStream.current;

			pcRef.current.onicecandidate = (e) => {
				if (e.candidate) {
				if (!socketRef.current) return;
				console.log("onicecandidate");
				socketRef.current.emit("candidate", e.candidate);
				}
			};
	
			pcRef.current.oniceconnectionstatechange = (e) => {
				console.log(e);
			};
	
			pcRef.current.ontrack = (ev) => {
				console.log("add remotetrack success");
				if (userVideo.current) {
					userVideo.current.srcObject = ev.streams[0];
					console.log(ev.streams[0])
					setUser(ev.streams[0].id)
				}
			};
	
			socketRef.current.emit("join_room", {
				room: "nowChat",
			});
		}
		
	}, [enableConnections])

	return (
		<>
		<h1 className="text-center">NowChat Video</h1>
		<div className="container">
			<div className="video-container">
				<div className="row">
					<div className="col text-center	">
						{enableCamera ? 
							(<div className="video">
								<video className="w-100" playsInline  ref={myVideo} autoPlay  />
								<h3 className="text-center my-2">My id: {me}</h3>
							</div>)
							:
							(<Button color="primary" aria-label="call" onClick={connected}>Enable Camera</Button>)
						}
					</div>
					<div className="col text-center	">
						<div className="video">
						{enableCamera && !enableConnections &&
						<Button color="primary" onClick={() => {setEnableConnections(true)}} >Accept VideoCalls</Button>
						}	
							<video className="w-100" playsInline ref={userVideo} autoPlay  />
							{enableConnections && <h3 className="text-center my-2">Visitor id: {user}</h3>}
						</div>
					</div>
				</div>
			</div>
		</div>
		</>
	)
}

export default Video