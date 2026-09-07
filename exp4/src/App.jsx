import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  memo,
  Profiler,
} from "react";

import "./App.css";


const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TIMES = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
];


const INITIAL_POSTS = [
  {
    id: 1,
    title: "Instagram Post",
    day: "Monday",
    time: "09:00 AM",
  },
  {
    id: 2,
    title: "Facebook Campaign",
    day: "Tuesday",
    time: "10:00 AM",
  },
  {
    id: 3,
    title: "Product Promotion",
    day: "Wednesday",
    time: "11:00 AM",
  },
  {
    id: 4,
    title: "LinkedIn Update",
    day: "Thursday",
    time: "01:00 PM",
  },
  {
    id: 5,
    title: "YouTube Video",
    day: "Friday",
    time: "02:00 PM",
  },
  {
    id: 6,
    title: "Weekend Campaign",
    day: "Saturday",
    time: "12:00 PM",
  },
];


function NormalPost({ post, onDragStart }) {
  return (
    <div
      className="post normal-post"
      draggable
      onDragStart={() => onDragStart(post)}
    >
      <strong>{post.title}</strong>

      <span>{post.day}</span>

      <span>{post.time}</span>
    </div>
  );
}


const OptimizedPost = memo(function OptimizedPost({
  post,
  onDragStart,
}) {
  return (
    <div
      className="post optimized-post"
      draggable
      onDragStart={() => onDragStart(post)}
    >
      <strong>{post.title}</strong>

      <span>{post.day}</span>

      <span>{post.time}</span>
    </div>
  );
});


function App() {

  const [optimized, setOptimized] =
    useState(false);

  const [posts, setPosts] =
    useState(INITIAL_POSTS);

  const [draggedPost, setDraggedPost] =
    useState(null);


  // Refs for performance measurement
  const renderCountRef = useRef(null);

  const renderTimeRef = useRef(null);

  const renderCounter = useRef(0);


  // Stable drag function
  const handleDragStart = useCallback(
    (post) => {
      setDraggedPost(post);
    },
    []
  );


  // Drop function
  const handleDrop = useCallback(
    (day, time) => {

      if (!draggedPost) return;

      setPosts((previousPosts) =>
        previousPosts.map((post) =>
          post.id === draggedPost.id
            ? {
                ...post,
                day: day,
                time: time,
              }
            : post
        )
      );

      setDraggedPost(null);

    },
    [draggedPost]
  );


  // NON-OPTIMIZED CALCULATION
  const normalSlots = {};

  DAYS.forEach((day) => {

    TIMES.forEach((time) => {

      const key = `${day}-${time}`;

      normalSlots[key] =
        posts.filter(
          (post) =>
            post.day === day &&
            post.time === time
        );

    });

  });


  // OPTIMIZED CALCULATION
  const optimizedSlots = useMemo(() => {

    const slots = {};

    DAYS.forEach((day) => {

      TIMES.forEach((time) => {

        const key = `${day}-${time}`;

        slots[key] =
          posts.filter(
            (post) =>
              post.day === day &&
              post.time === time
          );

      });

    });

    return slots;

  }, [posts]);


  const slots = optimized
    ? optimizedSlots
    : normalSlots;


  // PROFILER
  // IMPORTANT:
  // No setState here.
  // Otherwise infinite render loop happens.

  const handleProfilerRender = (
    id,
    phase,
    actualDuration
  ) => {

    renderCounter.current += 1;

    if (renderCountRef.current) {

      renderCountRef.current.textContent =
        renderCounter.current;

    }

    if (renderTimeRef.current) {

      renderTimeRef.current.textContent =
        actualDuration.toFixed(3) + " ms";

    }

  };


  return (

    <div className="container">

      <h1>Weekly Post Scheduler</h1>

      <p className="subtitle">
        Drag and drop posts to reschedule them
      </p>


      {/* TOGGLE BUTTONS */}

      <div className="toggle-container">

        <button
          className={
            !optimized ? "active" : ""
          }
          onClick={() =>
            setOptimized(false)
          }
        >
          Non-Optimized
        </button>


        <button
          className={
            optimized ? "active" : ""
          }
          onClick={() =>
            setOptimized(true)
          }
        >
          Optimized
        </button>

      </div>


      {/* PERFORMANCE METRICS */}

      <div className="performance">

        <div className="metric">

          <span>Current Mode</span>

          <strong>
            {optimized
              ? "Optimized"
              : "Non-Optimized"}
          </strong>

        </div>


        <div className="metric">

          <span>Render Count</span>

          <strong ref={renderCountRef}>
            0
          </strong>

        </div>


        <div className="metric">

          <span>Render Duration</span>

          <strong ref={renderTimeRef}>
            0 ms
          </strong>

        </div>

      </div>


      <div className="instruction">
        Drag a post and drop it into another
        day and time slot.
      </div>


      {/* WEEKLY SCHEDULER */}

      <Profiler
        id="WeeklyScheduler"
        onRender={handleProfilerRender}
      >

        <div className="schedule">


          {/* TABLE HEADER */}

          <div className="cell header">
            Time
          </div>


          {DAYS.map((day) => (

            <div
              className="cell header"
              key={day}
            >
              {day}
            </div>

          ))}


          {/* TABLE ROWS */}

          {TIMES.map((time) => (

            <React.Fragment key={time}>


              {/* TIME COLUMN */}

              <div className="cell time">

                {time}

              </div>


              {/* DAYS */}

              {DAYS.map((day) => {

                const key =
                  `${day}-${time}`;

                const cellPosts =
                  slots[key] || [];


                return (

                  <div
                    className="cell drop-zone"
                    key={key}

                    onDragOver={(event) =>
                      event.preventDefault()
                    }

                    onDrop={() =>
                      handleDrop(day, time)
                    }
                  >

                    {cellPosts.map((post) =>

                      optimized ? (

                        <OptimizedPost
                          key={post.id}
                          post={post}
                          onDragStart={
                            handleDragStart
                          }
                        />

                      ) : (

                        <NormalPost
                          key={post.id}
                          post={post}
                          onDragStart={
                            handleDragStart
                          }
                        />

                      )

                    )}

                  </div>

                );

              })}


            </React.Fragment>

          ))}


        </div>

      </Profiler>

    </div>

  );

}


export default App;