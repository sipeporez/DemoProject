import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import './App.css';
import BoardView from './Component/Board/BoardView';
import Home from './Component/Home';
import Login from './Component/Login';
import Register from './Component/Register';
import Sentiment from './Component/Sentiment/Sentiment';
import ToDoBase from './Component/ToDoList/ToDoBase';
import BackGroundColor from './Component/UI/BackGroundColor';
import NavBar from './Component/UI/NavBar';
import SideBar from './Component/UI/SideBar';
import VerifyEmail from './Component/Util/VerifyEmail';
import InfinityBase from './Component/InfinityScroll/InfinityBase';
import CheckOAuth from './Component/Login/CheckOAuth';

function App() {
  return (
    <BackGroundColor component={
      <RecoilRoot>
        <NavBar />
        <main>
          <SideBar />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/join" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/checkOAuth" element={<CheckOAuth />} />
              <Route path='/verify' element={<VerifyEmail />} />
              <Route path="/home" element={<Home />} />
              <Route path="/view" element={<BoardView />} />
              <Route path="/todo" element={<ToDoBase />} />
              <Route path="/senti" element={<Sentiment />} />
              <Route path="/scroll" element={<InfinityBase />} />
            </Routes>
          </BrowserRouter>
        </main>
      </RecoilRoot>
    }></BackGroundColor>
  );
}

export default App;
