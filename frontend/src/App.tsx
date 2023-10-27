import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Logout from "./pages/logout";
import Profile from "./pages/profile";
import Header from "./components/Header";
import Register from "./pages/register";
import About from "./pages/About";
import PrivateRouter from "./components/PrivateRouter";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/updateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/logout" element={<Logout />}></Route>       
        <Route path="/listing/:id" element={<Listing />}></Route>
        <Route path="/search" element={<Search />}></Route>


        <Route element={<PrivateRouter />}>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/create-listing" element={<CreateListing />}></Route>
          <Route path="/update-listing/:id" element={<UpdateListing />}></Route>
        </Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
