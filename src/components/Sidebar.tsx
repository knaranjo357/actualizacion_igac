import { Database, BarChart, LogOut, FileSpreadsheet } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white h-screen shadow-lg fixed left-0 top-0 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-600 mt-2">{currentUser?.email}</p>
      </div>
      <nav className="mt-6 flex-1">
        <Link
          to="/databases"
          className={`flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
            location.pathname === '/databases' ? 'bg-gray-100 border-r-4 border-blue-600' : ''
          }`}
        >
          <Database className="h-5 w-5" />
          <span>Databases</span>
        </Link>
        <Link
          to="/analytics/cica"
          className={`flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
            location.pathname === '/analytics/cica' ? 'bg-gray-100 border-r-4 border-blue-600' : ''
          }`}
        >
          <BarChart className="h-5 w-5" />
          <span>CICA Analytics</span>
        </Link>
        <Link
          to="/analytics/reconocedores"
          className={`flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
            location.pathname === '/analytics/reconocedores' ? 'bg-gray-100 border-r-4 border-blue-600' : ''
          }`}
        >
          <FileSpreadsheet className="h-5 w-5" />
          <span>Reconocedores Analytics</span>
        </Link>
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 w-full text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}