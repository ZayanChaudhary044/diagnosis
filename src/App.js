import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import Schecker from './pages/SymptomCheck';
import Login from './pages/Login';
import Stats from './pages/Stats';
import MediNews from './pages/MediNews';
import AssessMedi from './pages/AssessMedi';

function App() {
  return (
    <Router>
      <div>
        {<NavBar/>}

        <Routes>
          <Route path="/home-page" element={<HomePage/>}></Route>
          <Route path="/symp-check" element={<Schecker/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/stats" element={<Stats/>}></Route>
          <Route path="/news" element={<MediNews/>}></Route>
          <Route path="/assess-center" element={<AssessMedi/>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;