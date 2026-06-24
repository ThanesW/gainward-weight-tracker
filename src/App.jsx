import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppDataProvider } from './context/AppDataContext';
import { ThemeProvider } from './context/ThemeContext';
import BottomNav from './components/common/BottomNav';
import LoadingGate from './components/common/LoadingGate';
import Dashboard from './pages/Dashboard';
import AddFoodLog from './pages/AddFoodLog';
import FoodLogDetail from './pages/FoodLogDetail';
import WeightTracking from './pages/WeightTracking';

function Layout() {
  const location = useLocation();
  // Hide bottom nav on the add/edit form for a focused, full-screen entry flow
  const hideNav = location.pathname.startsWith('/add') || location.pathname.startsWith('/edit');

  return (
    <div className="min-h-screen">
      <LoadingGate>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddFoodLog />} />
          <Route path="/edit/:id" element={<AddFoodLog />} />
          <Route path="/log/:id" element={<FoodLogDetail />} />
          <Route path="/weight" element={<WeightTracking />} />
        </Routes>
        {!hideNav && <BottomNav />}
      </LoadingGate>
    </div>
  );
}

export default function App() {
  return (
    <AppDataProvider>
      <ThemeProvider>
        <HashRouter>
          <Layout />
        </HashRouter>
      </ThemeProvider>
    </AppDataProvider>
  );
}
