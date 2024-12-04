import { Button, Nav } from 'react-bootstrap';
import image from '../bl.jpg'
import { Link } from 'react-router-dom';
const HomePage =()=>{
    return(
        <>
         <div >
  <Nav className="mt-4  home" style={{display:"flex",flexDirection:"row",justifyContent:"end"}}>
    <Button variant='light' ><Link to="/login" style={{textDecoration:"none",color:"black"}}>Login</Link></Button>
    <Button variant='dark' className='mx-5'><Link to="/register" style={{textDecoration:"none",color:"white"}}>Register</Link></Button>
  </Nav>
  <div className='text-center w-100'>
  <h1 className='text-center display-1 fw-bolder my-4 py-3 '>Daily Blogs</h1>
  <div className='p-5 m-5'>
  <img src={image} alt="blogimg" width="80%" className='my-5 py-5' />
  </div>
  </div>
 </div>
        </>
    )
}
export default HomePage;