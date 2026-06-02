import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";

const BASE = "http://127.0.0.1:5000";

const makeModules = (items) =>
  items.map(([title, description, lessons, topics]) => ({ title, description, lessons, topics }));

function CourseDetails() {
  const navigate = useNavigate();
  const { courseName } = useParams();
  const [accessLevel, setAccessLevel] = useState("locked");
  const [selectedModule, setSelectedModule] = useState(null);

  const courseData = {
    python: {
      title: "Python Course",
      description:
        "Learn Python from beginner to advanced level including real-time projects, APIs, Flask, automation, and backend development.",
      modules: makeModules([
        ["Python Basics", "Set up Python, run scripts, and understand syntax, comments, and indentation.", 5, ["Installing Python and IDE setup", "Running your first script", "Understanding Python syntax and indentation", "Writing comments and documentation", "Using Python interactive shell"]],
        ["Variables & Data Types", "Work with strings, numbers, booleans, lists, tuples, sets, and dictionaries.", 6, ["Variable declaration and naming conventions", "Integer and Float operations", "String manipulation and formatting", "Boolean logic and comparisons", "Lists: creation, indexing, and methods", "Tuples, Sets, and Dictionaries"]],
        ["Functions", "Create reusable logic with parameters, return values, scope, and helper functions.", 5, ["Defining and calling functions", "Parameters and arguments", "Return values and multiple returns", "Variable scope and global variables", "Lambda and higher-order functions"]],
        ["Loops & Conditions", "Control program flow using if statements, for loops, while loops, and loop helpers.", 6, ["If, elif, and else statements", "Nested conditions", "For loop with iterables", "While loops and loop control", "Break and continue statements", "Else with loops"]],
        ["Object Oriented Programming", "Build classes, objects, constructors, methods, inheritance, and clean models.", 7, ["Classes and objects", "Constructors and initialization", "Instance methods and attributes", "Class methods and static methods", "Inheritance and super()", "Polymorphism and method overriding", "Encapsulation and access modifiers"]],
        ["File Handling", "Read, write, append, and organize files for real application workflows.", 4, ["Opening and closing files", "Reading file content", "Writing and appending to files", "Working with CSV and JSON files"]],
        ["Exception Handling", "Handle errors safely with try, except, finally, and custom exceptions.", 4, ["Try and except blocks", "Multiple exception handling", "Finally clause", "Custom exceptions"]],
        ["Flask Framework", "Create Flask routes, templates, APIs, and connect backend logic.", 7, ["Setting up Flask application", "Routes and request methods", "Templates with Jinja2", "Static files and CSS", "Request and response handling", "Error handling in Flask", "Deploying Flask apps"]],
        ["REST APIs", "Build JSON APIs, handle requests, responses, validation, and status codes.", 6, ["REST principles and HTTP methods", "JSON data format", "Request validation", "Status codes and responses", "Error handling in APIs", "API documentation with Swagger"]],
        ["Projects", "Apply Python in practical mini projects using files, APIs, and Flask.", 5, ["Building a To-Do application", "Weather API integration", "Web scraper project", "Chat application with sockets", "Personal portfolio website"]]
      ])
    },
    javascript: {
      title: "JavaScript Course",
      description:
        "Master JavaScript for frontend and backend development with modern ES6 concepts and projects.",
      modules: makeModules([
        ["Variables", "Understand let, const, data types, operators, and type conversion.", 5, ["Var, let, and const declarations", "Primitive data types (number, string, boolean, null, undefined)", "Objects and arrays", "Type conversion and coercion", "Operators: arithmetic, logical, comparison"]],
        ["Functions", "Use declarations, expressions, arrow functions, callbacks, and reusable logic.", 6, ["Function declarations and expressions", "Arrow functions and concise syntax", "Parameters, arguments, and default values", "Callback functions", "Closures and scope", "Higher-order functions"]],
        ["DOM Manipulation", "Select elements, update content, change styles, and build dynamic pages.", 6, ["Selecting DOM elements", "Creating and removing elements", "Changing text and HTML content", "Modifying CSS styles", "Working with classes and attributes", "DOM traversal"]],
        ["Events", "Handle clicks, inputs, forms, keyboard events, and event bubbling.", 5, ["Event listeners and handlers", "Click and input events", "Form submission handling", "Keyboard events", "Event bubbling and delegation"]],
        ["ES6 Features", "Use template strings, destructuring, spread, modules, and modern syntax.", 7, ["Template literals", "Destructuring objects and arrays", "Spread and rest operators", "Arrow functions", "Classes and inheritance", "Modules and imports/exports", "Promises and async/await"]],
        ["Async Await", "Write clean asynchronous code with async functions and error handling.", 5, ["Promises: creating and resolving", "Promise chaining", "Async and await keywords", "Error handling with try/catch", "Promise.all and Promise.race"]],
        ["Fetch API", "Call APIs, process JSON, handle loading states, and manage failures.", 5, ["Fetch syntax and basic requests", "GET, POST, PUT, DELETE methods", "Handling JSON responses", "Error handling", "Headers and authentication"]],
        ["Promises", "Understand promise chains, resolve/reject, and parallel async flows.", 4, ["Creating promises", "Resolving and rejecting", "Promise chaining", "Parallel promises"]],
        ["Local Storage", "Persist app data in the browser and restore user state.", 4, ["Storing data with localStorage", "Retrieving data", "Removing and clearing data", "JSON serialization"]],
        ["Projects", "Build interactive browser projects using APIs, forms, and storage.", 5, ["Weather app with API integration", "Todo list with local storage", "E-commerce product filter", "Chat interface", "Quiz application"]]
      ])
    },
    react: {
      title: "React Course",
      description:
        "Build powerful frontend applications using ReactJS, hooks, routing, and reusable components.",
      modules: makeModules([
        ["JSX", "Write JSX, render values, apply classes, and structure React UI.", 4, ["JSX syntax and elements", "Embedding expressions in JSX", "Conditional rendering", "Styling and className", "Fragments and lists"]],
        ["Components", "Create reusable components and organize screens into clean sections.", 6, ["Functional components", "Component composition", "Reusable component patterns", "Component props", "Default props", "Prop validation"]],
        ["Props", "Pass data between components and design predictable component APIs.", 4, ["Passing props to components", "Prop types and validation", "Default props", "Destructuring props"]],
        ["useState", "Manage UI state, forms, toggles, counters, and interactive behavior.", 5, ["useState hook basics", "State updates and batching", "Multiple state variables", "State with forms", "Lifting state up"]],
        ["useEffect", "Load data, react to changes, and clean up side effects.", 5, ["useEffect fundamentals", "Dependency arrays", "Cleanup functions", "Multiple useEffect hooks", "Common use cases"]],
        ["React Router", "Build multi-page navigation with routes, params, and redirects.", 5, ["Setting up React Router", "Route definitions", "Link and NavLink", "useParams and useNavigate", "Route protection"]],
        ["API Integration", "Fetch backend data, show loading states, and handle errors.", 6, ["Fetching data with useEffect", "Loading and error states", "POST requests", "Request interceptors", "Error boundaries", "API context"]],
        ["Forms", "Build controlled inputs, validation, and submit flows.", 5, ["Controlled components", "Form validation", "Input types and handlers", "Form libraries like Formik", "Error handling"]],
        ["Context API", "Share auth, user data, and settings across the app.", 4, ["Creating context", "Provider pattern", "useContext hook", "Context composition"]],
        ["Projects", "Create complete React features using routing, APIs, and state.", 6, ["Blog platform with routing", "E-commerce product catalog", "Real-time chat application", "Task management app", "Weather dashboard", "User authentication flow"]]
      ])
    },
    nodejs: {
      title: "NodeJS Course",
      description:
        "Learn backend development using NodeJS, Express, MongoDB, authentication, and REST APIs.",
      modules: makeModules([
        ["Node Basics", "Understand Node runtime, modules, npm, scripts, and backend structure.", 5, ["Node.js runtime environment", "CommonJS modules and require", "npm packages and package.json", "npm scripts", "Event-driven architecture"]],
        ["ExpressJS", "Create an Express server, configure responses, and organize app files.", 6, ["Setting up Express app", "Creating routes", "Request and response objects", "Middleware setup", "Static file serving", "Error handling"]],
        ["Routing", "Build route handlers for users, courses, files, and dynamic parameters.", 5, ["HTTP methods and handlers", "Route parameters", "Query strings", "Route organization", "RESTful routing"]],
        ["Middleware", "Use middleware for logging, validation, auth checks, and error handling.", 5, ["Understanding middleware", "Creating custom middleware", "Using third-party middleware", "Authentication middleware", "Error handling middleware"]],
        ["MongoDB", "Connect to a database, create schemas, and perform CRUD operations.", 7, ["MongoDB connection", "Collections and documents", "Mongoose schemas", "CRUD operations", "Data validation", "Indexing", "Aggregation pipelines"]],
        ["Authentication", "Build login/register flows and protect private backend routes.", 6, ["User registration", "Password hashing with bcrypt", "Login and sessions", "JWT tokens", "Protected routes", "Logout and token refresh"]],
        ["JWT", "Issue tokens, verify sessions, and manage role-based access.", 5, ["JWT structure and components", "Token generation", "Token verification", "Refresh tokens", "Role-based access control"]],
        ["REST APIs", "Design stable endpoints with request validation and clear status codes.", 6, ["RESTful API design", "HTTP status codes", "Request validation", "Response formatting", "API versioning", "Testing APIs"]],
        ["File Uploads", "Handle multipart uploads, validate files, and serve downloads.", 5, ["Multer middleware setup", "File validation", "File storage options", "Serving downloads", "Error handling for uploads"]],
        ["Projects", "Build a backend project with auth, database, uploads, and APIs.", 7, ["Complete REST API backend", "User management system", "File sharing platform", "E-commerce backend", "Real-time notification system", "Admin dashboard backend", "Payment integration"]]
      ])
    }
  };

  const course = courseData[courseName];
  const visibleModules = accessLevel === "demo" ? course?.modules.slice(0, 3) : course?.modules || [];

  useEffect(() => {
    const username = localStorage.getItem("username");

    if (!username) {
      navigate("/login");
      return;
    }

    const controller = new AbortController();

    fetch(`${BASE}/api/course-access/name/${username}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        const access = Array.isArray(data)
          ? data.find((item) => item.course_name.toLowerCase() === courseName.toLowerCase())
          : null;
        setAccessLevel(access?.access_level || "locked");
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setAccessLevel("locked");
        }
      });

    return () => controller.abort();
  }, [courseName, navigate]);

  if (!course) {
    return (
      <div className="course-page">
        <div className="course-container">
          <div className="course-empty">Course Not Found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="course-page">
      <div className="course-container">
        <div className="course-topbar">
          <button className="back-btn" onClick={() => navigate("/user")}>
            Back to Dashboard
          </button>

          <div className={`course-badge course-badge-${accessLevel}`}>
            {accessLevel === "full" ? "Full Access" : accessLevel === "demo" ? "Demo Access" : "Locked"}
          </div>
        </div>

        <h1 className="course-title">{course.title}</h1>
        <p className="course-description">{course.description}</p>

        <h3 className="course-section-title">
          {accessLevel === "locked" ? "Access Required" : "Course Modules"}
        </h3>

        {accessLevel === "locked" ? (
          <div className="course-empty">
            This course is locked. Please contact admin for demo or full access.
          </div>
        ) : (
          <>
            {accessLevel === "demo" && (
              <p className="course-access-note">
                Demo access includes the first {visibleModules.length} modules. Full access unlocks every module.
              </p>
            )}

            <div className="course-topics-grid">
              {visibleModules.map((module, index) => (
                <div 
                  className="topic-card" 
                  key={module.title}
                  onClick={() => setSelectedModule(module)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="topic-number">{String(index + 1).padStart(2, "0")}</div>
                  <div className="topic-title">{module.title}</div>
                  <p className="topic-description">{module.description}</p>
                  <div className="topic-meta">{module.lessons} lessons</div>
                  <div style={{ marginTop: "8px", fontSize: "12px", color: "#00d4ff" }}>
                    Click to view details
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Module Details Modal */}
      {selectedModule && (
        <div className="modal-overlay" onClick={() => setSelectedModule(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedModule.title}</h2>
              <button 
                className="modal-close" 
                onClick={() => setSelectedModule(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-description">{selectedModule.description}</p>

              <h3 style={{ marginTop: "20px", marginBottom: "15px", color: "#00d4ff" }}>
                Topics in this Module ({selectedModule.topics?.length || 0}):
              </h3>

              <div className="topics-list">
                {selectedModule.topics ? (
                  selectedModule.topics.map((topic, idx) => (
                    <div key={idx} className="topic-item">
                      <div className="topic-item-number">{idx + 1}.</div>
                      <div className="topic-item-content">
                        <div className="topic-item-title">{topic}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No topics available</p>
                )}
              </div>

              <div style={{ marginTop: "20px", padding: "12px", backgroundColor: "rgba(0, 212, 255, 0.1)", borderRadius: "4px" }}>
                <strong>Total Lessons:</strong> {selectedModule.lessons}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseDetails;
