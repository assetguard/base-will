import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import Home from "./pages/home/page";
import Inheritance from "./pages/inheritance/page";
// import { AssistantPage } from "./pages/assistant/page";
// import { ModulesPage } from "./pages/templates/page";
// import Layout from "./layout";
// import Home from "./pages/home/page";

const AppRoutes = () => {
  return (
    <Router>
      
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/home" element={<Home />} />
          <Route path="/inheritance" element={<Inheritance />} />
        </Routes>
      
    </Router>
  );
};

export default AppRoutes;
