import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="container-fluid">
            <div className="container pt-5 text-center">
                <h1>NowChat App</h1>
                <h5><em>a chat test app for Now Optics</em></h5>
            </div>
            <div className="row mt-5">
                <div className="col text-center">
                    <h3>Create New Users</h3>
                    <Link to="/users" className="btn btn-info mt-3">Manage Users</Link>
                </div>
                <div className="col text-center">
                    <h3>Beggin to Chat</h3>
                    <Link to="/chat" className="btn btn-success mt-3">Start Chat</Link>
                </div>
            </div>
        </div>        
    );
}

export default Home;