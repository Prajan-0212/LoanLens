import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Prediction from "./pages/Prediction/Prediction";
import Evaluation from "./pages/Evaluation/Evaluation";

function App() {
    return (
        <BrowserRouter>

            <Navbar />

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/prediction"
                    element={<Prediction />}
                />

                <Route
                    path="/evaluation"
                    element={<Evaluation />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;