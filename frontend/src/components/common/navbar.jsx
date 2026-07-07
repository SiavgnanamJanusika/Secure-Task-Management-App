import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">

    <a className="navbar-brand">
    J2A Secure Task
    </a>

    <div className="navbar-links">

    <a className="navbar-link active">
      Home
    </a>

    <a className="navbar-link">
      Tasks
    </a>

    <a className="navbar-link">
      Profile
    </a>

    <a className="navbar-link">
      Dashboard
    </a>

    </div>

    </nav>
  );
}