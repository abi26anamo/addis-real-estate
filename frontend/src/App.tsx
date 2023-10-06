import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Logout from './pages/logout';
import Profile from './pages/profile';
import Header from './components/Header';
import About from './pages/About';


const App = () => {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/about' element={<About/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/logout' element={<Logout />}></Route>
        <Route path='/profile' element={<Profile/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
