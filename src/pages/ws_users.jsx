import {useState, useEffect} from "react";
import Alert from 'react-bootstrap/Alert';


function WSUsers() {

    const baseUrl                       = 'http://localhost:5000/users';
    const [users, setUsers]             = useState([]);
    const [name, setName]               = useState('');
    const [email, setEmail]             = useState('');
    const [username, setUsername]       = useState('');
    const [title, setTitle]             = useState('Add User');
    const [userId, setUserId]           = useState(null);
    const [isEdit, setIsEdit]           = useState(false);
    const [successMsg, setSuccessMsg]   = useState(null);
    const [errorMsg, setErrorMsg]       = useState(null);
    const socket                        = new WebSocket('ws://localhost:8080');

    // Fetch all todos on page load or component mounted
    useEffect(() => {

        function websocketConnection() {
            socket.onopen = () => {
                console.log('WebSocket connection established.');

                const message = {
                    type: "All",
                    data: "Users",
                }
                socket.send(JSON.stringify(message));
            };
    
            socket.onmessage = (event) => {
                console.log(event.data);
            };
    
            return () => {
                socket.close();
            };
        }

        // Fetch all users
        const getUsers = async () => {
            try {
                //     // Fetch data from backend
                
                

            //     // Set users data to users state
            //     setUsers(response.data.data);

            //     // Show success message
            //     setSuccessMsg(response.data.message);
            } catch (error) {
                console.log(error.response);

                // Show error message
                setErrorMsg(error.response.data.message);
            } finally {
                // Hide success/error message after 5 seconds
                hideMsg();
            }
        };
        
        websocketConnection();
        getUsers();
    }, []);

    // Hide success/error message after 5 seconds
    const hideMsg = () => {
        setTimeout(() => {
            setSuccessMsg(null);
            setErrorMsg(null);
        }, 5000);
    };

    // Add new user
    const addUserHandler = async (e) => {
        // Prevent default form submission
        e.preventDefault();
        // try {
        //     // Send post request to backend by sending the data
        //     const response = await axios.post(`${baseUrl}`, {username, name, email});

        //     // Add new user and update users state
        //     setUsers([...users, response.data.data]);

        //     // Reset todo form
        //     setEmail('');
        //     setName('');
        //     setUsername('');
        //     setTitle('Add User');

        //     // Show success message
        //     setSuccessMsg(response.data.message);
        // } catch (error) {
        //     console.log(error.response);
        //     // Show error message
        //     setErrorMsg(error.response.data.message);
        // } finally {
        //     // Hide success/error message after 5 seconds
        //     hideMsg();
        // }
    };

    // Edit user
    const editUserHandler = async (user) => {
        // Set user data to users form
        setUsername(user.username);
        setName(user.name);
        setEmail(user.email);
        setUserId(user.id);
        setTitle('Edit User: ' + user.name);
        setIsEdit(true);
    };

    // Update user
    const updateUserHandler = async (e) => {
        // Prevent default form submission
        // e.preventDefault();
        // try {
        //     // Send put request to backend by sending User's data
        //     const response = await axios.put(`${baseUrl}/${userId}`, {username, name, email});
        
        //     // Update user in Users state
        //     const updatedUsers = users.map(user => {
        //         if (user.id === userId) {
        //             user.username     = username;
        //             user.name         = name;
        //             user.email         = email;
        //         }
        //         return user;
        //     });
        
        //     // Update todos state
        //     setUsers(updatedUsers);
        
        //     // Reset todo form
        //     setUsername('');
        //     setName('');
        //     setEmail('');
        //     setTitle('Add User');
        //     setUserId(null);
        //     setIsEdit(false);
        
        //     // Show success message
        //     setSuccessMsg(response.data.message);
        // } catch (error) {
        //     console.log(error.response);
        //     // Show error message
        //     setErrorMsg(error.response.data.message);
        // } finally {
        //     // Hide success/error message after 5 seconds
        //     hideMsg();
        // }
    };

    // Delete User
    const deleteUserHandler = async (id) => {
        // try {
        //     // Send delete request to backend
        //     const response      = await axios.delete(`${baseUrl}/${id}`);
        
        //     // Remove user from Users state
        //     const filteredUsers = users.filter(user => user.id !== id);
        
        //     // Update Users state
        //     setUsers(filteredUsers);
        
        //     // Show success message
        //     setSuccessMsg(response.data.message);
        // } catch (error) {
        //     console.log(error.response);
        //     // Show error message
        //     setErrorMsg(error.response.data.message);
        // } finally {
        //     // Hide success/error message after 5 seconds
        //     hideMsg();
        // }
    };

    // Submit handler
    const submitHandler = async (e) => {
        // Conditionally call addUserHandler or updateUserHandler
        if (isEdit) {
            await updateUserHandler(e);
        } else {
            await addUserHandler(e);
        }
    };

    // Cancel/Reset user form
    const cancelUserHandler = () => {
        setName('');
        setEmail('');
        setUsername('');
        setTitle('Add User');
        setIsEdit(false);
    };

    return (
        <div className="container-fluid">
            <div className="container pt-5 text-center">
                <h1>NowChat App</h1>
                <p>All the users in the app</p>
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
            <div className="row">
                <div className="col">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h4 className="card-title">
                                {title}
                            </h4>
                        </div>
                        <form onSubmit={submitHandler}>
                            <div className="card-body">
                                <div className="form-group mb-3">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <input id="username" name="username" className="form-control"
                                            placeholder="Enter username" required autoFocus value={username}
                                            onChange={e => setUsername(e.target.value)}/>
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input className="form-control" name="name"
                                                id="name"
                                                placeholder="Enter name" required value={name}
                                                onChange={e => setName(e.target.value)} />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input className="form-control" name="email"
                                                id="email" 
                                                placeholder="Enter email" required value={email}
                                                onChange={e => setEmail(e.target.value)} />
                                </div>
                            </div>
                            <div className="card-footer">
                                <p className="text-end">
                                    <button type="button" className="btn btn-danger btn-lg" onClick={cancelUserHandler}>
                                        Cancel
                                    </button>
                                    {isEdit ?
                                        <button type="submit" className="btn btn-primary btn-lg ms-2">
                                            Update
                                        </button> :
                                        <button type="submit" className="btn btn-primary btn-lg ms-2">
                                            Save
                                        </button>}
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title text-center">
                                Users
                            </h4>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered table-hover table-striped">
                                    <thead>
                                        <tr>
                                        <th className="text-center">#</th>
                                        <th>Username</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {users.map((user, index) => (
                                      <tr key={index}>
                                          <td className="text-center">{index + 1}</td>
                                          <td>{user.username}</td>
                                          <td>{user.name}</td>
                                          <td>{user.email}</td>
                                          <td className="text-center">
                                              <button type="button" className="btn btn-sm btn-primary btn-sm"
                                                      onClick={editUserHandler.bind(this, user)}>
                                                  Edit
                                              </button>
                                              <button type="button" className="btn btn-sm btn-danger btn-sm ms-2"
                                                      onClick={deleteUserHandler.bind(this, user.id)}>
                                                  Delete
                                              </button>
                                          </td>
                                      </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>    
        </div>        
    );
}

export default WSUsers;