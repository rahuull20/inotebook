import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import About from './components/About';
//import NoteState from './context/notes/NoteState';

function App() {
  return (
    <>

      <Router>
        <NavBar />
        <div className="container">
          <Routes>
            <Route exact path='/' element={<Home />} />
            <Route exact path='/about' element={<About />} />
          </Routes>
        </div>
      </Router>

    </>
  );
}

export default App;
