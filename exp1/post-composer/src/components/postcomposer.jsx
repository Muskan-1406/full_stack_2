import { useState } from "react";
import "./PostComposer.css";

const platformLimits = {
  Twitter: 280,
  Facebook: 5000,
  Instagram: 2200,
};

function PostComposer() {
  const [platform, setPlatform] = useState("Twitter");
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");

  const limit = platformLimits[platform];
  const remaining = limit - text.length;

  const handlePublish = () => {
    setMessage("✅ Post Published Successfully!");
    setText("");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <div className="container">
      <h2>Social Media Post Composer</h2>

      <label>Select Platform</label>

      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
      >
        <option>Twitter</option>
        <option>Facebook</option>
        <option>Instagram</option>
      </select>

      <textarea
        placeholder="Write your post..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <p>
        Characters: {text.length}/{limit}
      </p>

      {remaining >= 0 ? (
        <p className="success">
          {remaining} characters remaining
        </p>
      ) : (
        <p className="error">
          Character limit exceeded by {-remaining}
        </p>
      )}

      <button
        disabled={remaining < 0 || text.trim() === ""}
        onClick={handlePublish}
      >
        Publish
      </button>

      {message && (
        <p className="success">{message}</p>
      )}
    </div>
  );
}

export default PostComposer;