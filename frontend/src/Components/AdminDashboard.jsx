import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import{jwtDecode }from 'jwt-decode';
import { MdDelete ,MdVisibility} from "react-icons/md";
const AdminDashboard = () => {
  
    const [adminName, setAdminName] = useState('');
  const [users, setUsers] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  console.log(adminName)

  useEffect(() => {
    fetchUsers();
    fetchBlogs();
    fetchAdminDetails(); 
  }, []);

  // Fetch admin details from token
  const fetchAdminDetails = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);  // Decode the JWT
        
        setAdminName(decoded.userName);  // Set the admin's username
      } catch (error) {
        console.error('Failed to decode token:', error);
        setError('Error fetching admin details.');
      }
    } else {
      setError('No token found.');
    }
  };
  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log(response.data)
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all blogs
  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/admin/blogs', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setBlogs(response.data.blogs);
    } catch (err) {
      setError('Failed to fetch blogs.');
    }
  };

  // Delete a user
  const handleDeleteUser = async (userId) => {
    // Show a confirmation prompt to the user
    const confirmDelete = window.confirm('Are you sure you want to delete this blog?');
    if (confirmDelete) {
    try {
      await axios.delete(`http://localhost:4000/api/admin/deleteUser/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      fetchUsers(); // Re-fetch users after deletion
      fetchBlogs(); // Re-fetch blogs to ensure the blogs of the deleted user are removeds
    } catch (err) {
      setError('Failed to delete user.');
    }
} else {
    console.log('Delete canceled.');
  }
  };

  // Delete a blog
  const handleDeleteBlog = async (blogId) => {
    // Show a confirmation prompt to the user
    const confirmDelete = window.confirm('Are you sure you want to delete this blog?');
  
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:4000/api/admin/deleteBlog/${blogId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        fetchBlogs(); // Re-fetch blogs after deletion
      } catch (err) {
        setError('Failed to delete blog.');
      }
    } else {
      console.log('Delete canceled.');
    }
  };
  
  // view a blog
  const handleVisibility = (blog)=>{
    //Navigate to the blog page
    navigate(`/blog/${blog._id}`);
  };
 // edit a blog
//  const handleEditBlog=(blog)=>{
//     navigate(`/edit-blog/${blog._id}`);
//  };
 

  return (
    <div className="admin-dashboard-container text-center mt-2 p-5">
        <div  className='d-flex justify-content-between mx-5'><h2>Admin Dashboard</h2><h4 className='text-light' > {adminName}</h4></div>
     

      {loading && <p>Loading...</p>}
      {error && <p className="error-message text-danger bg-light mx-auto rounded-4 p-1 fw-bold"style={{width:"max-content"}}>{error}</p>}

      {/* Users Section */}
      <div className="section text-center m-5">
        <h2 className='fw-bold m-5'>Users</h2>
        <div className='border border-4 border-dark shadow-2 rounded w-100 mx-auto p-3 'style={{backgroundColor:"aliceblue"}} >
        <Table striped>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user?.userName || "N/A"}</td>
                <td>{user?.userEmail || "N/A"}</td>
                <td>
                  <MdDelete size="25" style={{cursor:"pointer"}} onClick={() => handleDeleteUser(user._id)}/>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div>
      </div>

      {/* Blogs Section */}
      <div className="section text-center m-5 ">
        <h2 className='fw-bold m-5'>Blogs</h2>
        <div className='border border-4 border-dark shadow-2 rounded w-100 mx-auto p-3'style={{backgroundColor:"aliceblue"}} >
        <Table striped>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id}>
                <td>{blog?.title || "No title"}</td>
                <td>{blog?.author?.userName || "Unknown Author"}</td>
                <td>
                {/* <MdEdit size="25" style={{cursor:"pointer"}} onClick={() => handleEditBlog(blog)}/>  */}
                  <MdDelete size="25" style={{cursor:"pointer"}} onClick={() => handleDeleteBlog(blog._id)}/>
                    <MdVisibility size="25" style={{cursor:"pointer"}} onClick={()=>handleVisibility(blog)}/>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

