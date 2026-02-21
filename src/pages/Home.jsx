const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Welcome to Suraksha Sathi
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          A smart solution to enhance safety and protection using modern
          technology.
        </p>

        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Home;
