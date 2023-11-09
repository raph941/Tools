import { Link, Outlet, useLocation } from "react-router-dom";
import logo from "./images/gitstart-brand.svg";

function App() {
  const { pathname } = useLocation();
  const isRoot = pathname === "/";

  return (
    <div className="App">
      <header className="p-5 md:px-16 border-b">
        <Link to="/">
          <img src={logo} className="" alt="logo" />
        </Link>
      </header>

      {isRoot && (
        <main className="min-h-visible-screen h-full p-8 md:px-16">
          <div>
            <h1 className="font-semibold text-2xl md:text-3xl mb-6">Tools</h1>

            <ul className="flex flex-col gap-6 list-disc">
              <li className="font-semibold underline ml-6">
                <Link to="/stack-audit">Tech stack audit </Link>
              </li>
              <li className="font-semibold underline ml-6">
                <Link to="/xp-calculator">XP Calculator</Link>
              </li>
            </ul>
          </div>
        </main>
      )}
      <Outlet />
    </div>
  );
}

export default App;
