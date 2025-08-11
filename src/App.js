import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import Schecker from './pages/SymptomCheck';
import Stats from './pages/Stats';
import MediNews from './pages/MediNews';
import AssessMedi from './pages/AssessMedi';
import Auth from './pages/Auth';  

function App() {
  return (
    <Router>
      <div>
        {<NavBar/>}

        <Routes>
          <Route path="/" element={<HomePage/>}></Route>
          <Route path="/symp-check" element={<Schecker/>}></Route>
          <Route path="/auth" element={<Auth/>}></Route>
          <Route path="/stats" element={<Stats/>}></Route>
          <Route path="/news" element={<MediNews/>}></Route>
          <Route path="/assess-center" element={<AssessMedi/>}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;