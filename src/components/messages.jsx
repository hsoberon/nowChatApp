import {Card, Badge} from 'react-bootstrap';
import { useRef, useEffect, useState } from 'react';
import useWebSocket from "react-use-websocket"
import './messages.css';


const Messages = (props) => {

    console.log('Rendering Chat');

    const fromID = props.userFrom;
    const toID = props.userTo;

    const onError = props.onError;
    const hide = props.hide;

    const baseUrl                       = 'ws://127.0.0.1:8080/';
    const [chat, setChat]               = useState([]);

    const {sendJsonMessage, lastJsonMessage } = useWebSocket(baseUrl, {
        queryParams: { userFrom: fromID, userTo: toID},
        share: false,
    });

    

    useEffect(() => {
        console.log("From: " + fromID + ' To: ' + toID);

        sendJsonMessage({
            type: "GET",
            message: "Chat",
        });
    }, [sendJsonMessage, fromID, toID]);

    useEffect(() => {
        if(lastJsonMessage?.success){
            if(lastJsonMessage.type === 'Chat'){
                setChat(lastJsonMessage.data);
                console.log(lastJsonMessage.message);
            }
        }else if(lastJsonMessage?.message){
            //Error
            onError('ERROR:' + lastJsonMessage.message);
            hide();
        }
    }, [lastJsonMessage, onError, hide]);



    const AlwaysScrollToBottom = () => {
        const elementRef = useRef();
        useEffect(() => elementRef.current.scrollIntoView({behavior: 'smooth'}));
        return <div ref={elementRef} />;
    };

    function MessageText ({text, from_id, time}) {
        const hmTime = new Date(time).toLocaleString();
        if(from_id === parseInt(fromID)){
            return <h5>
                <Badge size="lg" bg="primary">{text}</Badge> <small className='text-secondary'>{hmTime}</small> 
            </h5>
        }else{
            return <h5 className="text-end">
                <small className='text-secondary'>{hmTime}</small> <Badge size="lg" bg="success">{text}</Badge>
            </h5>
        }
    }

    return (
        <Card className="my-4 bg-secondary text-white">
            <Card.Body>
                <Card.Title className="text-center">
                    List of messages
                </Card.Title>
                <div className="chat bg-white p-3">
                    {chat.map((chat, index) => (
                       <MessageText key={index} text={chat.message} from_id={chat.from_id} time={chat.created} ></MessageText> 
                    ))}
                    <AlwaysScrollToBottom />
                </div>
            </Card.Body>
        </Card>
    )
}

export default Messages;