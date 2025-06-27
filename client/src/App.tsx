// non Emulator
import "./App.css";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function App() {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <Home />
    </div>
  );
}

export default App;
