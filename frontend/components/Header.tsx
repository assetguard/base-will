import { useNavigate, useLocation } from "react-router-dom";
import { WalletSelector } from "./WalletSelector";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: any) => {
    return location.pathname === path ? "text-green" : "text-navy hover:text-green";
  };

  return (
    <header className=" shadow-sm">
      <div className="container mx-auto px-8 py-6 flex flex-col sm:flex-row justify-between items-center">
        <h1 onClick={() => navigate("/")} className="text-xl font-semibold text-green mb-4 sm:mb-0 cursor-pointer">
          AssetGuard
        </h1>
        <nav className="mb-4 sm:mb-0 text-base ">
          <ul className="flex space-x-10 ">
            <li onClick={() => navigate("/home")}>
              <a className={`cursor-pointer ${isActive("/home")}`}>Home</a>
            </li>
            <li onClick={() => navigate("/inheritance")}>
              <a className={`cursor-pointer ${isActive("/inheritance")}`}>Inheritance</a>
            </li>
            <li>
              <a className="text-navy hover:text-green cursor-pointer ">Testimonials</a>
            </li>
          </ul>
        </nav>
        <WalletSelector />
      </div>
    </header>
  );
}
