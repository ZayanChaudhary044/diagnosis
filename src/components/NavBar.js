import { Link } from 'react-router-dom';
import '../NavBar.css';
import HomePage from '../pages/HomePage';
import Schecker from '../pages/SymptomCheck';
import Login from '../pages/Login';
import Stats from '../pages/Stats';
import AssessMedi from '../pages/AssessMedi';
import News from '../pages/MediNews';

function NavBar() {
    return(
        <div>
            <h1>AskMedi</h1>
            <ul>
                <li><Link to="home-page" element={<HomePage />}>Home</Link></li>
                <li><Link to="news" element={<News />}>MediNews</Link></li>
                <li><Link to="symp-check" element={<Schecker />}>Diagnosis</Link></li>
                <li><Link to="stats" element={<Stats />}>Statistics</Link></li>
                <li><Link to="assess-center" element={<AssessMedi />}>AssessMedi</Link></li>

                <div className="loginbutton">
                    <li><Link to="login" element={<Login />} className="glass-button">Login</Link></li>
                </div>
            </ul>
        </div>
    );
};

export default NavBar;
