import {Card, Badge} from 'react-bootstrap';
import { useRef, useEffect } from 'react';
import './messages.css';


const Messages = (props) => {

    console.log("Printing chat");

    const firstUser = props.firstUser;

    const AlwaysScrollToBottom = () => {
        const elementRef = useRef();
        useEffect(() => elementRef.current.scrollIntoView({behavior: 'smooth'}));
        return <div ref={elementRef} />;
    };

    function MessageText ({text, from_id, time}) {
        const hmTime = new Date(time).toLocaleString();
        if(from_id === parseInt(firstUser)){
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
                    {props.listMessages.map((chat, index) => (
                       <MessageText key={index} index={index} text={chat.message} from_id={chat.from_id} time={chat.created} ></MessageText> 
                    ))}
                    <AlwaysScrollToBottom />
                </div>
            </Card.Body>
        </Card>
    )
}

export default Messages;