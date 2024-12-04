import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';  // Corrected import for jwt-decode
import { Link, useNavigate, useParams } from "react-router-dom"; // Import useNavigate from react-router-dom
import { Button, Form, Card } from 'react-bootstrap';
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { MdOutlineInsertComment } from "react-icons/md";
import { MdVisibility } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
const UserDashboard = () => {
  const { id } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [userBlogs, setUserBlogs] = useState([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [showAllBlogs, setShowAllBlogs] = useState(true);
  const [showCommentInput, setShowCommentInput] = useState({});
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  useEffect(() => {

    const fetchUserDetails = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserName(decoded.userName);  // Set the user's username
        } catch (error) {
          console.error('Failed to decode token:', error);
          setError('Error fetching user details.');
        }
      } else {
        setError('No token found.');
      }
    };
    fetchUserDetails();


    // Fetch all blogs

    axios
      .get("http://localhost:4000/api/blog/blogs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setBlogs(response.data.blogs);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      }, []);
    console.log(id)
    // Fetch user-specific blogs
    axios
      .get(`http://localhost:4000/api/blog/myblogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserBlogs(response.data.blogs);
      })
      .catch((error) => console.log(error));
  }, []);





  const handleLike = async (blogId) => {
    try {
      await axios.put(
        `http://localhost:4000/api/blog/like/${blogId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Optimistically update like count
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === blogId
            ? {
              ...blog, likes: blog.likes.includes(localStorage.getItem("userId"))
                ? blog.likes.filter((like) => like !== localStorage.getItem("userId"))
                : [...blog.likes, localStorage.getItem("userId")]
            }
            : blog
        )
      );
      setUserBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === blogId
            ? {
              ...blog, likes: blog.likes.includes(localStorage.getItem("userId"))
                ? blog.likes.filter((like) => like !== localStorage.getItem("userId"))
                : [...blog.likes, localStorage.getItem("userId")]
            }
            : blog
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };



  const handleDelete = async (blogId) => {
    // Show confirmation alert before proceeding
    const isConfirmed = window.confirm("Are you sure you want to delete this blog?");

    // If user clicks "Cancel", stop execution
    if (!isConfirmed) {
      return;
    }

    try {
      await axios.delete(`http://localhost:4000/api/blog/deleteBlog/${blogId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      // Optionally, handle success (e.g., remove the deleted blog from UI)
    } catch (err) {
      console.error('Error deleting blog:', err);
      setError('Failed to delete blog.');
    }
  };
  const handleComment = async (blogId) => {
    const commentText = comment[blogId] || '';

    // Don't allow empty comments
    if (!commentText.trim()) return;

    // Optimistically update the comment count and display
    setBlogs((prevState) =>
      prevState.map((blog) =>
        blog._id === blogId
          ? {
            ...blog,
            comments: [
              ...blog.comments,
              { content: commentText, userId: localStorage.getItem("userId") }, // Add the new comment
            ],
          }
          : blog
      )
    );

    try {
      // Post the comment to the backend
      await axios.post(
        `http://localhost:4000/api/blog/comment/${blogId}`,
        { content: commentText },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      // Clear the input field after commenting
      setComment((prevState) => ({ ...prevState, [blogId]: "" }));
      setShowCommentInput((prevState) => ({ ...prevState, [blogId]: false }));

    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment.");

      // If there was an error, revert the optimistic update (remove the comment)
      setBlogs((prevState) =>
        prevState.map((blog) =>
          blog._id === blogId
            ? {
              ...blog,
              comments: blog.comments.filter(
                (comment) => comment.content !== commentText
              ), // Remove the optimistic comment
            }
            : blog
        )
      );
    }
  };


  const toggleCommentInput = (blogId) => {
    setShowCommentInput((prevState) => ({
      ...prevState,
      [blogId]: !prevState[blogId],
    }));
  };

  const handleVisibility = (blog) => {
    navigate(`/blog/${blog._id}`);
  };


  return (
    <div className="user-dashboard-container text-center mt-2 p-5">
      <div className='d-flex justify-content-between mx-5'>
        <h2>User Dashboard</h2>
        <h4 className='text-light'>{userName}</h4>
      </div>

      <hr />
      <div className="d-flex justify-content-between ">


        {/* Toggle Buttons */}
        <div>
          <Button onClick={() => setShowAllBlogs(true)} variant="primary" className="m-3">
            My Blogs
          </Button>
          <Button onClick={() => setShowAllBlogs(false)} variant="secondary" className="m-3">
            All Blogs
          </Button>
        </div>
        <Link to="/create-blog" >
          <Button variant="outline-light" className="m-3">Create New Blog</Button>
        </Link></div>
      <div>
        {/* My Blogs Section */}
        {showAllBlogs && (
          <div>

            <div className="d-flex justify-content-evenly flex-wrap">
              {loading ? (<p>Loading...</p>) : userBlogs.length > 0 ? (userBlogs.map((blog) => (
                <Card key={blog._id} className="mb-4 w-25 m-3">
                  <Card.Body>
                    <Card.Title>{blog.title}</Card.Title>
                    <Card.Text>{blog.content.substring(0, 150) + '...'}</Card.Text>
                    <CiEdit size="30" color="blue" style={{ cursor: "pointer" }} className="m-3 fw-bold" onClick={() => (navigate(`/edit-blog/${blog._id}`))} />{' '}
                    <MdDeleteOutline size="30" color="red" style={{ cursor: "pointer" }} className="m-3 fw-bold" onClick={() => handleDelete(blog._id)} />
                  </Card.Body>
                </Card>
              ))) : (<p>No blogs available.</p>)}

            </div>
          </div>
        )}

        {/* All Blogs Section */}
        {!showAllBlogs && (
          <div>

            <div className="d-flex justify-content-evenly flex-wrap">
              {loading ? (
                <p>Loading...</p>
              ) : blogs.length > 0 ? (
                blogs.map((blog) => (
                  <Card key={blog._id} className="mb-4 w-25 m-3">
                    <Card.Body>
                      <Card.Title>{blog.title}</Card.Title>
                      <Card.Text>{blog.content.substring(0, 150) + "..."}</Card.Text>
                      <MdVisibility
                        size="25"
                        className="mx-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleVisibility(blog)}
                      />

                      {blog.likes.includes(localStorage.getItem("userId")) ? (
                        <FaHeart size="20" color="red" onClick={() => handleLike(blog._id)} />
                      ) : (
                        <FaRegHeart size="20" color="red" onClick={() => handleLike(blog._id)} />
                      )}
                      <sub>{blog.likes.length}</sub>
                      <MdOutlineInsertComment
                        size="20"
                        onClick={() => toggleCommentInput(blog._id)}
                        style={{ cursor: "pointer", marginLeft: "10px" }}
                      />
                      <sub>{blog.comments.length}</sub>

                      {/* Show comment input when toggled */}
                      {showCommentInput[blog._id] && (
                        <>
                          <Form.Group className="mt-3">
                            <Form.Control
                              type="text"
                              value={comment[blog._id] || ""}  // Default to an empty string if undefined
                              onChange={(e) =>
                                setComment((prevState) => ({
                                  ...prevState,
                                  [blog._id]: e.target.value,
                                }))
                              }
                              placeholder="Add a comment"
                            />

                          </Form.Group>
                          <Button variant="success" onClick={() => handleComment(blog._id)}>
                            Comment
                          </Button>
                        </>
                      )}
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p>No blogs available.</p>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default UserDashboard;

