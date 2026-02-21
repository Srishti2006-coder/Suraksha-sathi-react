import { useState } from "react";
import Welcome from "./pages/Welcome"
import Home from "./pages/Home";
import BottomNav from "./components/BottomNav";

function App() {

  const [startApp, setStartApp] = useState(false);

  return (

    <div>

      {startApp ? (
        <>
          <Home />
          <BottomNav />
        </>
      ) : (
        <Welcome setStartApp={setStartApp}/>
      )}

    </div>

  );
}

export default App;