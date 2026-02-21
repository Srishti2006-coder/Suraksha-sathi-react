const BottomNav = () => {
  return (

    <div className="fixed bottom-0 w-full bg-white shadow-lg border-t flex justify-around p-3">

      <button className="flex flex-col items-center">
        🏠
        <span className="text-xs">Home</span>
      </button>

      <button className="flex flex-col items-center">
        🗺️
        <span className="text-xs">Routes</span>
      </button>

      <button className="flex flex-col items-center">
        🚨
        <span className="text-xs">SOS</span>
      </button>

      <button className="flex flex-col items-center">
        👤
        <span className="text-xs">Profile</span>
      </button>

    </div>

  );
};

export default BottomNav;