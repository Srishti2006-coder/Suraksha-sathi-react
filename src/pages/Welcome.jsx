function Welcome({ setStartApp }) {

  return (

    <div className="h-screen bg-gradient-to-b from-gray-100 to-white flex flex-col justify-center items-center">

      <div className="bg-white p-6 rounded-full shadow-lg mb-6">

        <div className="text-blue-500 text-5xl">
          🛣️
        </div>

      </div>

      <h1 className="text-3xl font-bold mb-2">
        SurakshaSathi
      </h1>

      <p className="text-gray-500 mb-10">
        Because every journey deserves safety
      </p>


      <button
        onClick={() => setStartApp(true)}
        className="bg-blue-500 text-white px-16 py-3 rounded-xl shadow-md"
      >

        Get Started

      </button>


    </div>

  );
}

export default Welcome;