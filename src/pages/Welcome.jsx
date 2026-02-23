const Welcome = ({ setPage }) => {
  return (

    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">

      <div className="bg-white p-10 rounded-xl shadow-md text-center w-80">

        <h1 className="text-3xl font-bold mb-2">
          Suraksha Sathi
        </h1>

        <p className="text-gray-500 mb-6">
          Turning every journey into a safer experience.
        </p>

        <button
          onClick={() => setPage("login")}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          Get Started
        </button>

      </div>

    </div>

  );
};

export default Welcome;