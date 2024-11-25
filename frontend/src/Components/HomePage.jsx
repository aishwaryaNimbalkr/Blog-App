import { Button, Nav } from 'react-bootstrap';
import image from '../bl.jpg'
import { Link } from 'react-router-dom';
const HomePage =()=>{
    return(
        <>
         <div >
  <Nav className="mt-5 d-flex justify-content-end">
    <Button variant='light' ><Link to="/login" style={{textDecoration:"none",color:"black"}}>Login</Link></Button>
    <Button variant='dark' className='mx-5'><Link to="/register" style={{textDecoration:"none",color:"white"}}>Register</Link></Button>
  </Nav>
  <div className='text-center w-100'>
  <h1 className='text-center display-1 fw-bolder  py-5 '>Daily Blogs</h1>
  <img src={image} alt="blogimg" width="80%"  />
  </div>
 </div>
        </>
    )
}
export default HomePage;