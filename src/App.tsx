import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Modal from "./assets/Modal/Modal";


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Modal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
