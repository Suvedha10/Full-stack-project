import axios from "axios";
import { useEffect, useState } from "react";

const App = () => {
  const API_URL = "https://mongo-final.vercel.app/api/posts";

  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editPostId, setEditPostId] = useState(null);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(API_URL);
      setPosts(response.data);
      console.log(response);
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  };

  const createPost = async () => {
    try {
      const response = await axios.post(API_URL, {
        course: newPost,
        description: newDescription,
      });
      setPosts([...posts, response.data]);
      setNewPost("");
      setNewDescription("");
    } catch (error) {
      console.log("Error creating post", error);
    }
  };

  const updatePost = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, {
        course: newPost,
        description: newDescription,
      });
      setPosts(posts.map((post) => (post._id === id ? response.data : post)));
      setNewPost("");
      setNewDescription("");
      setEditPostId(null);
    } catch (error) {
      console.error("Error editing post", error);
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setPosts(posts.filter((post) => post._id !== id));
    } catch (error) {
      console.error("Error deleting post", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Course Posts</h1>
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Enter course"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="input input-bordered w-full"
          />
          <input
            type="text"
            placeholder="Enter description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="input input-bordered w-full"
          />
          {editPostId ? (
            <button
              onClick={() => updatePost(editPostId)}
                className="btn btn-primary w-full text-white bg-pink-600 hover:bg-orange-700 focus:outline-white focus:ring-2 focus:ring-blue-500 rounded-md py-2"
>
               Edit Post
              </button>
          ) : (
            <button
              onClick={createPost}
              className="btn btn-accent w-full"
            >
              Create Post
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post._id} className="card w-full bg-base-100 shadow-md">
            <div className="card-body bg-white text-black">
              <h2 className="card-title">{post.course}</h2>
              <p>{post.description}</p>
              <div className="card-actions justify-end space-x-2">
                <button
                  onClick={() => {
                    setEditPostId(post._id);
                    setNewPost(post.course);
                    setNewDescription(post.description);
                  }}
                  className="btn btn-warning"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePost(post._id)}
                  className="btn btn-error"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;

