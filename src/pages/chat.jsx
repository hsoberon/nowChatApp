import {useState, useEffect, useRef} from "react";
import Messages from '../components/messages'; 
import {Alert, Form, Row, Col, Button} from 'react-bootstrap';
import io from "socket.io-client";

function WSChat() {
    const baseUrl                       = useRef(process.env.REACT_APP_WS_URL);
    const [users, setUsers]             = useState([]);
    const [chat, setChat]               = useState([]);
    const [userFrom, setUserFrom]       = useState(null);
    const [userTo, setUserTo]           = useState(null);
    const [successMsg, setSuccessMsg]   = useState(null);
    const [errorMsg, setErrorMsg]       = useState(null);
    const socketRef = useRef();
    
    // Fetch all users on page load or component mounted
    useEffect(() => {

        socketRef.current = io.connect(baseUrl.current);

        
        const initialSetup = async () => {
            // Fetch all users
            socketRef.current.emit("users");
            

            socketRef.current.on("allusers", (info) => {
                console.log(info.message)
                if(info.success){
                    setUsers(info.data)
                }
            });

            socketRef.current.on("messages", (info) => {
                console.log(info.message)
                if(info.success){
                    setChat(info.data)
                }
            });

            socketRef.current.on("newMessages", (info) => {
                console.log(info.message)
                if(info.success){
                    console.log("new message from %s to %s", info.data.from_id, info.data.to_id)
                    socketRef.current.emit("chat", {
                        userFrom: info.data.from_id, 
                        userTo: info.data.to_id
                    });
                }
            });

            

        };
        
        initialSetup();
    }, []);

    useEffect(() => {
        if(userFrom && userTo){
            console.log('Request from %s %s', userFrom, userTo);
            socketRef.current.emit("chat", {userFrom, userTo});
        }
    }, [userFrom, userTo])

    // Hide success/error message after 5 seconds
    const hideMsg = () => {
        setTimeout(() => {
            setSuccessMsg(null);
            setErrorMsg(null);
        }, 5000);
    };

    const sendMessage = async (event) => {
        event.preventDefault();

        const from_id = event.target.from_id.value;
        const text = event.target.text.value;
        const to_id = (from_id === userFrom) ? userTo : userFrom;

        if(!userTo || !userFrom){
            setErrorMsg("Debes seleccionar un usuario primero");
            hideMsg();
            return;
        }

        if(text === ""){
            setErrorMsg("Mensaje Vacío");
            hideMsg();
            return;
        }

        socketRef.current.emit("sendMessage", {
            userFrom : from_id, 
            userTo: to_id,
            text: text,
        });

        //reset the text message field
        event.target.text.value = '';
    };

    return (
        <div className="container-fluid">
            <div className="container pt-5 text-center">
                <h1>NowChat App</h1>
                <p>Select two users to start the chat</p>
                <div className="alert-wrapper">
                    {successMsg &&
                        <Alert variant="success" dismissible>
                            {successMsg}
                        </Alert>
                    }
                    {errorMsg &&
                        <Alert variant="danger" dismissible>
                            {errorMsg}
                        </Alert>
                    }
                </div>
            </div>
            <div className="row mt-3">
                <div className="col">
                    <Form id="first-message" onSubmit={sendMessage}>
                        <h3 className="text-center">First User {userFrom}</h3>
                        <Form.Group as={Row} className="mt-3">
                            <Col md="12">
                                <Form.Select className="mb-3" size="lg" id="first-user" name="from_id" onChange={e => setUserFrom(e.target.value)}>
                                    <option >Select the First User</option>
                                    {users.map((user, index) => (
                                        <option key={index} value={user.id}>{user.name}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Form.Label column lg="2" className="text-end text-success">
                                Message:
                            </Form.Label>
                            <Col lg="6" xl="7">
                                <Form.Control name="text" className="mb-3 mb-lg-0" type="text" id="first-user-message" />
                            </Col>
                            <Col lg="4" xl="3" className="d-grid gap-2">
                                <Button as="input" type="submit" variant="outline-success" value="Send Message" />{' '}
                            </Col>                            
                        </Form.Group>
                    </Form>
                </div>
                <div className="col">
                    <Form id="second-message" onSubmit={sendMessage}>
                        <h3 className="text-center">Second User</h3>
                        <Form.Group as={Row} className="mt-3">
                            <Col md="12">
                                <Form.Select className="mb-3" size="lg" id="second-user" name="from_id"  onChange={e => setUserTo(e.target.value)}>
                                    <option >Select the Second User</option>
                                    {users.map((user, index) => (
                                        <option key={index} value={user.id}>{user.name}</option>
                                    ))}
                                </Form.Select>
                            </Col>
                            <Form.Label column md="2" className="text-end text-info">
                                Message:
                            </Form.Label>
                            <Col lg="6" xl="7">
                                <Form.Control name="text" className="mb-3 mb-lg-0" type="text" id="second-user-message" />
                            </Col>
                            <Col lg="4" xl="3" className="d-grid gap-2">
                                <Button as="input" type="submit" variant="outline-info" value="Send Message" />{' '}
                            </Col>                            
                        </Form.Group>
                    </Form>
                </div>
            </div>
            {userFrom && userTo && 
                <Messages chat={chat} userFrom={userFrom} userTo={userTo} ></Messages>
            }
        </div>
    );
}

export default WSChat;