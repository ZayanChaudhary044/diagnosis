import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import Schecker from './pages/SymptomCheck';
import Login from './pages/Login';
import Stats from './pages/Stats';

function App() {
  return (
    <Router>
      <div>
        {<NavBar/>}

        <Routes>
          <Route path="home-page" element={<HomePage/>}></Route>
          <Route path="/" element={<Schecker/>}></Route>
          <Route path="/" element={<Login/>}></Route>
          <Route path="/" element={<Stats/>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;