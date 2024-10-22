import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import Login from './Component/Login';
import Home from './Component/Home';
import Register from './Component/Register';


function App() {
  return (
    <BrowserRouter>
    <Routes>
    <Route  path ="/join" element={<Register/>} />
    <Route  path ="/" element={<Login/>} />
    <Route  path ="/home" element={<Home/>} />
    </Routes>
    
    </BrowserRouter>
  );
}

export default App;
