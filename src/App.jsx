import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';


const App = () => {

  const API_URL = "https://fullstackproject-gilt.vercel.app/api/movie"; 

  const [form, setForm] = useState({
    movie_name: '',
    movie_rating: 0,
    description: '',
    image: null,
    preview: ''
  });

  const [movies, setMovies] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Fetch movies from the backend
  const fetchMovies = async () => {
    try {
      const response = await axios.get(API_URL);
      const updatedMovies = response.data.map((movie) => {
        if (movie.image && movie.image.data) {
          const base64Image = `data:image/jpeg;base64,${Buffer.from(movie.image.data).toString('base64')}`;
          return { ...movie, image: base64Image };
        }
        return movie;
      });
      setMovies(updatedMovies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // Handle form submission for creating or updating a movie

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('movie_name', form.movie_name);
      formData.append('movie_rating', form.movie_rating);
      formData.append('description', form.description);
  
      // Check if image is selected, append to FormData
      if (form.image) {
        formData.append('image', form.image);
      }
  
      // Log form data for debugging purposes
      console.log("Submitting FormData:", formData);
  
      // If editing, update movie; else, create a new movie
      if (editingId) {
        // Updating movie
        await axios.put(`${API_URL}/${editingId}`, formData);
        setEditingId(null); // Clear editing ID after update
      } else {
        // Creating new movie
        await axios.post(API_URL, formData);
      }
  
      // Reset form fields
      setForm({
        movie_name: '',
        movie_rating: '',
        description: '',
        image: null,
        preview: null,
      });
  
      // Refresh the movies list after the submit
      fetchMovies();
    } catch (error) {
      // Enhanced error logging for better debugging
      console.error("Error submitting movie form:", error);
      if (error.response) {
        console.error("Response Error:", error.response.data);
      }
    }
  };
  
  

  // Delete a movie by ID
  const deleteMovie = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setMovies(movies.filter((movie) => movie._id !== id)); // Remove from UI after delete
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  // Handle file change for image upload
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setForm({ ...form, image: file, preview: reader.result });
      };

      reader.readAsDataURL(file);
    }
  };

  // Set form data for editing a movie
  const editMovie = (movie) => {
    setForm({
      movie_name: movie.movie_name,
      movie_rating: movie.movie_rating,
      description: movie.description,
      image: null,
      preview: movie.image,
    });
    setEditingId(movie._id);
  };

  // Fetch movies on initial load
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-8">Movie Management</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-base-100 p-6 rounded-lg shadow-md max-w-xl mx-auto mb-8"
        >
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Movie Name</span>
            </label>
            <input
              type="text"
              placeholder="Movie Name"
              value={form.movie_name}
              onChange={(e) => setForm({ ...form, movie_name: e.target.value })}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Rating</span>
            </label>
            <input
              type="number"
              placeholder="Rating"
              value={form.movie_rating}
              onChange={(e) => setForm({ ...form, movie_rating: e.target.value })}
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="textarea textarea-bordered w-full"
              required
            />
          </div>
          <div className="form-control mb-4">
            <input type="file" onChange={handleFileChange} className="file-input file-input-bordered w-full" />
            {form.preview && (
              <img
                src={form.preview}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg mt-4"
              />
            )}
          </div>
          <button type="submit" className="btn btn-primary w-full">
            {editingId ? 'Update Movie' : 'Create Movie'}
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div key={movie._id} className="card bg-base-100 shadow-md">
              <figure>
                <img
                  src={movie.image}
                  alt={movie.movie_name}
                  className="w-70 h-48 object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{movie.movie_name}</h2>
                <p>Rating: {movie.movie_rating}</p>
                <p>{movie.description}</p>
                
                <div className="card-actions justify-end">
                  <button
                    onClick={() => editMovie(movie)}
                    className="btn btn-info btn-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMovie(movie._id)}
                    className="btn btn-error btn-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;










// import axios from "axios";
// import { useEffect, useState } from "react";

// const App = () => {
//   const API_URL = "https://mongo-final.vercel.app/api/posts";

//   const [posts, setPosts] = useState([]);
//   const [newPost, setNewPost] = useState("");
//   const [newDescription, setNewDescription] = useState("");
//   const [editPostId, setEditPostId] = useState(null);

//   const fetchPosts = async () => {
//     try {
//       const response = await axios.get(API_URL);
//       setPosts(response.data);
//       console.log(response);
//     } catch (error) {
//       console.log("Error fetching posts:", error);
//     }
//   };

//   const createPost = async () => {
//     try {
//       const response = await axios.post(API_URL, {
//         course: newPost,
//         description: newDescription,
//       });
//       setPosts([...posts, response.data]);
//       setNewPost("");
//       setNewDescription("");
//     } catch (error) {
//       console.log("Error creating post", error);
//     }
//   };

//   const updatePost = async (id) => {
//     try {
//       const response = await axios.put(`${API_URL}/${id}`, {
//         course: newPost,
//         description: newDescription,
//       });
//       setPosts(posts.map((post) => (post._id === id ? response.data : post)));
//       setNewPost("");
//       setNewDescription("");
//       setEditPostId(null);
//     } catch (error) {
//       console.error("Error editing post", error);
//     }
//   };

//   const deletePost = async (id) => {
//     try {
//       await axios.delete(`${API_URL}/${id}`);
//       setPosts(posts.filter((post) => post._id !== id));
//     } catch (error) {
//       console.error("Error deleting post", error);
//     }
//   };

//   useEffect(() => {
//     fetchPosts();
//   }, []);

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-3xl font-bold text-center mb-6">Course Posts</h1>
//       <div className="bg-white p-4 rounded-lg shadow-md mb-6">
//         <div className="flex flex-col space-y-4">
//           <input
//             type="text"
//             placeholder="Enter course"
//             value={newPost}
//             onChange={(e) => setNewPost(e.target.value)}
//             className="input input-bordered w-full"
//           />
//           <input
//             type="text"
//             placeholder="Enter description"
//             value={newDescription}
//             onChange={(e) => setNewDescription(e.target.value)}
//             className="input input-bordered w-full"
//           />
//           {editPostId ? (
//             <button
//               onClick={() => updatePost(editPostId)}
//                 className="btn btn-primary w-full text-white bg-pink-600 hover:bg-orange-700 focus:outline-white focus:ring-2 focus:ring-blue-500 rounded-md py-2"
// >
//                Edit Post
//               </button>
//           ) : (
//             <button
//               onClick={createPost}
//               className="btn btn-accent w-full"
//             >
//               Create Post
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="space-y-4">
//         {posts.map((post) => (
//           <div key={post._id} className="card w-full bg-base-100 shadow-md">
//             <div className="card-body bg-white text-black">
//               <h2 className="card-title">{post.course}</h2>
//               <p>{post.description}</p>
//               <div className="card-actions justify-end space-x-2">
//                 <button
//                   onClick={() => {
//                     setEditPostId(post._id);
//                     setNewPost(post.course);
//                     setNewDescription(post.description);
//                   }}
//                   className="btn btn-warning"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => deletePost(post._id)}
//                   className="btn btn-error"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default App;

