import "./App.css";

function App() {
  return (
    <>
      <div className="min-h-screen text-gray-100">
        <div className="container mx-auto px-6 py-12">
          <div className="flex justify-center">
            <img src="/static/logo.png" className="w-24 h-24 mb-4" />
          </div>
          <h1 className="text-4xl font-extrabold text-center mb-8">
            Welcome to the Workout Database API
          </h1>
          <p className="text-center text-lg mb-12 max-w-2xl mx-auto">
            Discover a comprehensive API to power your fitness apps with
            structured workout data, seamless integration, and high performance.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 shadow-xl transform hover:-translate-y-2 transition flex flex-col">
              <div className="flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-100 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.263.82-.583 0-.288-.01-1.05-.015-2.06-3.338.725-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.09-.745.082-.73.082-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.83 2.807 1.3 3.492.995.108-.775.418-1.3.76-1.6-2.665-.3-5.467-1.332-5.467-5.93 0-1.31.47-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.52 11.52 0 013.005-.405c1.02.005 2.045.138 3.005.405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.37.81 1.095.81 2.21 0 1.6-.015 2.88-.015 3.27 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <h2 className="text-xl font-semibold">GitHub Repository</h2>
              </div>
              <a
                href="https://github.com/arnabuchiha/workoutdb-api"
                target="_blank"
                className="mt-auto text-blue-400 hover:text-blue-200"
              >
                View on GitHub →
              </a>
            </div>
            <div className="card bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 shadow-xl transform hover:-translate-y-2 transition flex flex-col">
              <div className="flex items-center mb-4">
                <svg
                  className="h-6 w-6 text-gray-100 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                >
                  <path
                    fill="#ffffff"
                    d="M96 0C43 0 0 43 0 96L0 416c0 53 43 96 96 96l288 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64c17.7 0 32-14.3 32-32l0-320c0-17.7-14.3-32-32-32L384 0 96 0zm0 384l256 0 0 64L96 448c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16zm16 48l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"
                  />
                </svg>
                <h2 className="text-xl font-semibold">API Documentation</h2>
              </div>
              <a
                href="/docs"
                target="_blank"
                className="mt-auto text-blue-400 hover:text-blue-200"
              >
                Read Docs →
              </a>
            </div>
            <div className="card bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 shadow-xl transform hover:-translate-y-2 transition flex flex-col">
              <div className="flex items-center mb-4">
                <svg
                  className="h-6 w-6 text-gray-100 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="#ffffff"
                    d="M96 0C60.7 0 32 28.7 32 64l0 384c0 35.3 28.7 64 64 64l288 0c35.3 0 64-28.7 64-64l0-384c0-35.3-28.7-64-64-64L96 0zM208 288l64 0c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16c0-44.2 35.8-80 80-80zm-32-96a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM512 80c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64zM496 192c-8.8 0-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64c0-8.8-7.2-16-16-16zm16 144c0-8.8-7.2-16-16-16s-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16s16-7.2 16-16l0-64z"
                  />
                </svg>
                <h2 className="text-xl font-semibold">Contact Me</h2>
              </div>
              <p className="mb-4">
                Instagram:
                <a
                  href="https://www.instagram.com/arnab._.ray"
                  target="_blank"
                  className="text-blue-400 hover:text-blue-200"
                >
                  @arnabray
                </a>
              </p>
              <p className="mb-4">
                Portfolio:
                <a
                  href="https://www.arnabray.in"
                  target="_blank"
                  className="text-blue-400 hover:text-blue-200"
                >
                  arnabray.in
                </a>
              </p>
              <a
                href="mailto:ad733943@gmail.com"
                target="_blank"
                className="mt-auto text-blue-400 hover:text-blue-200"
              >
                Get in Touch →
              </a>
            </div>
            <div className="card bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 shadow-xl transform hover:-translate-y-2 transition flex flex-col">
              <div className="flex items-center mb-4">
                <img
                  src="/static/RapidAPI_idWtkaEhHE_1.png"
                  alt="RapidAPI"
                  className="h-6 w-6 text-gray-100 mr-2"
                />
                <h2 className="text-xl font-semibold">RapidAPI</h2>
              </div>
              <a
                href="https://rapidapi.com/ad733943/api/workout-db-api"
                target="_blank"
                className="mt-auto text-blue-400 hover:text-blue-200"
              >
                Explore on RapidAPI →
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
