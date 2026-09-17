import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    return (
        <header className="navbar">

            <Link
                className="brand"
                to="/"
                aria-label="LoanLens home"
            >
                <div
                    className="brand-mark"
                    aria-hidden="true"
                >
                    L
                </div>

                <div>
                    <h1>LoanLens</h1>
                    <span>Intelligent lending insights</span>
                </div>
            </Link>


            <nav
                className="nav-links"
                aria-label="Main navigation"
            >

                <Link to="/">
                    Home
                </Link>

                <Link to="/prediction">
                    Predict
                </Link>

                <Link to="/evaluation">
                    Evaluation
                </Link>

                <a href="/#how-it-works">
                    How it works
                </a>

                <a href="/#about">
                    About
                </a>

                <Link
                    className="nav-button"
                    to="/prediction"
                >
                    Get Started
                </Link>

            </nav>

        </header>
    );
}

export default Navbar;