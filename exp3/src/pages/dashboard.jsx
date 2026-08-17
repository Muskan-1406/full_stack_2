import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authslice";
import { useNavigate } from "react-router-dom";

const defaultPosts = [
  {
    id: 1,
    title: "Welcome to Post Composer",
    content:
      "This is the first post. Admin can edit or delete it.",
  },
  {
    id: 2,
    title: "Role Based Access Control",
    content:
      "Different users get different permissions.",
  },
];

function Dashboard() {
  const { user } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = user?.role;

  // -------------------------
  // Permissions
  // -------------------------

  const permissions = {
    admin: {
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: true,
    },

    editor: {
      canView: true,
      canCreate: false,
      canEdit: true,
      canDelete: false,
    },

    viewer: {
      canView: true,
      canCreate: false,
      canEdit: false,
      canDelete: false,
    },
  };

  const userPermissions =
    permissions[role];

  // -------------------------
  // Posts
  // -------------------------

  const [posts, setPosts] = useState(() => {
    const savedPosts =
      localStorage.getItem("posts");

    return savedPosts
      ? JSON.parse(savedPosts)
      : defaultPosts;
  });

  // -------------------------
  // Composer
  // -------------------------

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [editingId, setEditingId] =
    useState(null);

  // -------------------------
  // Save posts
  // -------------------------

  useEffect(() => {
    localStorage.setItem(
      "posts",
      JSON.stringify(posts)
    );
  }, [posts]);

  // -------------------------
  // Logout
  // -------------------------

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // -------------------------
  // CREATE POST
  // -------------------------

  const handleCreate = () => {
    if (!userPermissions.canCreate) {
      alert(
        "You do not have permission to create posts."
      );
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert(
        "Please enter title and content."
      );
      return;
    }

    const newPost = {
      id: Date.now(),
      title: title,
      content: content,
    };

    setPosts([
      ...posts,
      newPost,
    ]);

    setTitle("");
    setContent("");

    alert("Post created successfully!");
  };

  // -------------------------
  // START EDIT
  // -------------------------

  const handleEdit = (post) => {
    if (!userPermissions.canEdit) {
      alert(
        "You do not have permission to edit posts."
      );
      return;
    }

    setEditingId(post.id);
    setTitle(post.title);
    setContent(post.content);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // -------------------------
  // SAVE EDIT
  // -------------------------

  const handleSaveEdit = () => {
    if (!userPermissions.canEdit) {
      alert(
        "You do not have permission to edit posts."
      );
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert(
        "Title and content cannot be empty."
      );
      return;
    }

    setPosts(
      posts.map((post) =>
        post.id === editingId
          ? {
              ...post,
              title: title,
              content: content,
            }
          : post
      )
    );

    setEditingId(null);
    setTitle("");
    setContent("");

    alert("Post updated successfully!");
  };

  // -------------------------
  // DELETE POST
  // -------------------------

  const handleDelete = (id) => {
    if (!userPermissions.canDelete) {
      alert(
        "You do not have permission to delete posts."
      );
      return;
    }

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this post?"
      );

    if (!confirmDelete) {
      return;
    }

    setPosts(
      posts.filter(
        (post) => post.id !== id
      )
    );

    alert("Post deleted successfully!");
  };

  // -------------------------
  // CANCEL EDIT
  // -------------------------

  const handleCancel = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
  };

  // -------------------------
  // Role name
  // -------------------------

  const roleName =
    role?.charAt(0).toUpperCase() +
    role?.slice(1);

  return (
    <div className="dashboard">

      {/* ================= HEADER ================= */}

      <header className="dashboard-header">

        <div>
          <h1>Post Composer</h1>

          <p>
            Welcome,{" "}
            <strong>
              {user?.name}
            </strong>
          </p>
        </div>

        <div className="user-info">

          <span className="role-badge">
            {roleName}
          </span>

          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>

        </div>

      </header>

      {/* ================= PERMISSIONS ================= */}

      <section className="permissions">

        <h2>Your Permissions</h2>

        <div className="permission-grid">

          <div>
            👁️ View
            <span>
              {userPermissions.canView
                ? "Allowed"
                : "Denied"}
            </span>
          </div>

          <div>
            ✍️ Create
            <span>
              {userPermissions.canCreate
                ? "Allowed"
                : "Denied"}
            </span>
          </div>

          <div>
            📝 Edit
            <span>
              {userPermissions.canEdit
                ? "Allowed"
                : "Denied"}
            </span>
          </div>

          <div>
            🗑️ Delete
            <span>
              {userPermissions.canDelete
                ? "Allowed"
                : "Denied"}
            </span>
          </div>

        </div>

      </section>

      {/* ================= COMPOSER ================= */}

      {userPermissions.canCreate ||
      userPermissions.canEdit ? (
        <section className="composer">

          <h2>
            {editingId
              ? "Edit Post"
              : "Create New Post"}
          </h2>

          <input
            type="text"
            placeholder="Post title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <textarea
            placeholder="Write your post..."
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            rows="6"
          />

          <div className="composer-buttons">

            {!editingId &&
              userPermissions.canCreate && (
                <button
                  onClick={handleCreate}
                  className="primary-button"
                >
                  Create & Save Post
                </button>
              )}

            {editingId &&
              userPermissions.canEdit && (
                <>
                  <button
                    onClick={handleSaveEdit}
                    className="primary-button"
                  >
                    Save Changes
                  </button>

                  <button
                    onClick={handleCancel}
                    className="secondary-button"
                  >
                    Cancel
                  </button>
                </>
              )}

          </div>

        </section>
      ) : (
        <section className="view-only-message">

          <h2>View Only Mode</h2>

          <p>
            You are logged in as a Viewer.
            You can read posts but cannot
            create, edit, or delete them.
          </p>

        </section>
      )}

      {/* ================= POSTS ================= */}

      <section className="posts-section">

        <div className="posts-heading">

          <h2>All Posts</h2>

          <span>
            {posts.length} posts
          </span>

        </div>

        {posts.length === 0 ? (
          <div className="empty-posts">
            No posts available.
          </div>
        ) : (
          posts.map((post) => (

            <article
              key={post.id}
              className="post-card"
            >

              <div className="post-content">

                <h3>
                  {post.title}
                </h3>

                <p>
                  {post.content}
                </p>

              </div>

              {/* ACTIONS */}

              <div className="post-actions">

                {/* VIEW */}

                {userPermissions.canView && (
                  <button
                    className="view-button"
                    onClick={() =>
                      alert(
                        `${post.title}\n\n${post.content}`
                      )
                    }
                  >
                    View
                  </button>
                )}

                {/* EDIT */}

                {userPermissions.canEdit && (
                  <button
                    className="edit-button"
                    onClick={() =>
                      handleEdit(post)
                    }
                  >
                    Edit
                  </button>
                )}

                {/* DELETE */}

                {userPermissions.canDelete && (
                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDelete(post.id)
                    }
                  >
                    Delete
                  </button>
                )}

              </div>

            </article>

          ))
        )}

      </section>

    </div>
  );
}

export default Dashboard;