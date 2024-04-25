import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container">
            <Link to="/" className="navbar-brand"><b>NowChat APP</b></Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to="/" className="nav-link active">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/users" className="nav-link">Users</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/chat" className="nav-link">Chat</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/video" className="nav-link">Video</Link>
                    </li>
                </ul>
            </div>
            <div className="ms-auto">
                <Link to="https://hsoberon.com" className="nav-link" target="_blank">
                    <small>By H'Soberon</small>
                </Link>
            </div>
        </div>
    </nav>
  );
}

export default Navbar;

