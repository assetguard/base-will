import { useNavigate, useLocation } from "react-router-dom";
import { WalletSelector } from "./WalletSelector";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: any) => {
    return location.pathname === path ? "text-blue-600" : "text-white hover:text-blue-600";
  };

  return (
    <header className=" shadow-sm">
      <div className="container mx-auto px-8 py-6 flex flex-col sm:flex-row justify-between items-center">
        <h1 onClick={() => navigate("/")} className="text-2xl font-bold text-white mb-4 sm:mb-0 cursor-pointer">
          AssetGuard
        </h1>
        <nav className="mb-4 sm:mb-0 ">
          <ul className="flex space-x-4 ">
            <li onClick={() => navigate("/home")}>
              <a className={`cursor-pointer ${isActive("/home")}`}>Home</a>
            </li>
            <li onClick={() => navigate("/inheritance")}>
              <a className={`cursor-pointer ${isActive("/inheritance")}`}>Inheritance</a>
            </li>
            <li>
              <a className="text-gray-600 hover:text-blue-600 cursor-pointer text-white">Testimonials</a>
            </li>
          </ul>
        </nav>
        <WalletSelector />
      </div>
    </header>
  );
}
