const Signup = ({ setPage }) => {
  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow-md w-80">

        <h2 className="text-2xl font-bold text-center mb-6">
          Sign Up
        </h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 mb-4 rounded"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-4 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 mb-4 rounded"
        />

        <button
          onClick={() => setPage("home")}
          className="w-full bg-black text-white py-2 rounded"
        >
          Create Account
        </button>

        <p className="text-sm mt-4 text-center">

          Already have an account?

          <span
            onClick={() => setPage("login")}
            className="text-blue-600 cursor-pointer ml-1"
          >
            Login
          </span>

        </p>

      </div>

    </div>

  );
};

export default Signup;