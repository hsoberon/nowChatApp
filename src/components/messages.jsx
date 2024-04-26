import {Card, Badge} from 'react-bootstrap';
import {useEffect, useRef} from "react";
import './messages.css';


const Messages = ({chat, userFrom, userTo}) => {

    const AlwaysScrollToBottom = () => {
        const elementRef = useRef();
        useEffect(() => elementRef.current.scrollIntoView({behavior: 'smooth'}));
        return <div ref={elementRef} />;
    };

    function MessageText ({text, from_id, time}) {
        const hmTime = new Date(time).toLocaleString();
        if(from_id === parseInt(userFrom)){
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
                    {chat.map((msg, index) => (
                       <MessageText key={index} text={msg.message} from_id={msg.from_id} time={msg.created} ></MessageText> 
                    ))}
                    <AlwaysScrollToBottom />
                </div>
            </Card.Body>
        </Card>
    )
}

export default Messages;