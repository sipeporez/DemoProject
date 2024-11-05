import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Component/Login';
import Home from './Component/Home';
import Register from './Component/Register';
import BoardView from './Component/Board/BoardView';
import { RecoilRoot } from 'recoil';
import ToDoBase from './Component/ToDoList/ToDoBase';

function App() {
  return (
      <RecoilRoot>
        <BrowserRouter>
          <Routes>
            <Route path="/join" element={<Register />} />
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/view" element={<BoardView />} />
            <Route path="/todo" element={<ToDoBase/>} />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
  );
}

export default App;
