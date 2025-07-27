import { Link } from 'react-router';

export const AppHeader = () => {
  return (
    <nav className="w-full">
      <ul className="flex gap-x-3 px-3 py-1">
        <li>
          <Link to="/" className="text-lg text-blue-600">
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" className="text-lg text-blue-600">
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
};
