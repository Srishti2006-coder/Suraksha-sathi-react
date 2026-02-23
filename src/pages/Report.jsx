const Report = () => {
  return (

    <div className="min-h-screen p-10">

      <h1 className="text-3xl font-bold">
        Report Unsafe Area
      </h1>

      <textarea
        className="mt-4 border p-3 w-full"
        placeholder="Describe area"
      />

      <button className="mt-4 bg-black text-white px-6 py-2">
        Submit Report
      </button>

    </div>

  );
};

export default Report;