import Clock from "./components/Clock";
import "./App.css";

function App() {
  return (
    <div className="container">
      {/* LEFT */}
      <div className="left">
        <video autoPlay loop muted>
          <source src="/light.mp4" type="video/mp4" />
        </video>
      </div>

      {/* RIGHT */}
      <div className="right">
        {/* floating balls */}
        <ul className="particles">
          <li></li><li></li><li></li><li></li><li></li>
          <li></li><li></li><li></li><li></li><li></li>
        </ul>

        <Clock />
      </div>
    </div>
  );
}

export default App;
