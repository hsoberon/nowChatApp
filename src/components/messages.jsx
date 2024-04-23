import {Card, Badge} from 'react-bootstrap';


const Messages = (props) => {

    console.log("Printing chat");

    const firstUser = props.firstUser;

    function MessageText ({index, text, from_id, time}) {
        console.log(index + ': ' + time);
        if(from_id == firstUser){
            return <h5>
                <Badge size="lg" bg="primary">{text}</Badge> <span>{time}</span>
            </h5>
        }else{
            return <h5 className="text-end">
                <Badge size="lg" bg="success">{text}</Badge>
            </h5>
        }
    }

    return (
        <Card className="mt-4 bg-secondary text-white">
            <Card.Body>
                <Card.Title className="text-center">
                    List of messages
                </Card.Title>
                <div className="bg-white p-3">
                    {props.listMessages.map((chat, index) => (
                       <MessageText key={index} index={index} text={chat.message} from_id={chat.from_id} time={chat.created} ></MessageText> 
                    ))}
                </div>
            </Card.Body>
        </Card>
    )
}

export default Messages;