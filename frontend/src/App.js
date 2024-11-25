import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './Components/HomePage';
import Login from './Components/Login';
import Register from './Components/Register';
import UserDashboard from './Components/UserDashboard';
import AdminDashboard from './Components/AdminDashboard';
import EditBlog from './Components/EditBlog';
import BlogDetail from './Components/BlogDetail';

function App() {
  return (
    <BrowserRouter>
 <>
<Routes>
  <Route path="/" element={<HomePage/>}/>
  <Route path="/login" element={<Login/>}/>
  <Route path="/register" element={<Register/>}/>
  <Route path="/userDashboard" element={<UserDashboard/>}/>
  <Route path="/adminDashboard" element={<AdminDashboard/>}/>
  <Route path="/edit-blog/:id" element={<EditBlog/>} />
  <Route path="/blog/:id" element={<BlogDetail/>}/>

</Routes>
 </>
 </BrowserRouter>
  );
}

export default App;
