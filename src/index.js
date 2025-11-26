import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import SalesDashboard from './SalesDashboard';
import ReportPage from './pages/ReportPage';
import AdvancedDashboard from './pages/AdvancedDashboard';
import AdvancedDashboardV2 from './pages/AdvancedDashboardV2';
import AIChatbot from './components/AIChatbot';
import { LayoutDashboard, FileText, CreditCard, Filter, Users, Building2, MapPin, Calendar, Activity, FileBarChart, BarChart3, Settings } from 'lucide-react';

const NavItem = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-200 ${isActive
        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
        }`}
    >
      <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110' : ''}`} />
      <span>{label}</span>
      {isActive && (
        <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>
      )}
    </NavLink>
  );
};

const Layout = ({ children }) => {
  const [dashboardData, setDashboardData] = React.useState({});

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const localforage = (await import('localforage')).default;
        const localDB = localforage.createInstance({
          name: 'SalesDashboardDB',
          storeName: 'datasets'
        });
        const datasets = await localDB.getItem('sales_dashboard_datasets');
        if (datasets && Array.isArray(datasets)) {
          const activeDatasets = datasets.filter(ds => ds.isActive);
          if (activeDatasets.length > 0) {
            const merged = {};
            activeDatasets.forEach(({ data }) => {
              if (!data.sheets) return;
              Object.entries(data.sheets).forEach(([key, sheet]) => {
                if (!merged[key]) merged[key] = [];
                merged[key] = merged[key].concat(sheet.data || []);
              });
            });
            setDashboardData(merged);
          }
        }
      } catch (error) {
        console.error('Error loading data for chatbot:', error);
      }
    };
    loadData();
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/advanced-analytics" icon={BarChart3} label="Analytics" />
            <NavItem to="/advanced-analytics-v2" icon={Settings} label="Analytics V2" />
            <div className="w-px h-6 bg-gray-300 mx-2 shrink-0"></div>
            <NavItem to="/order-booked" icon={FileText} label="Orders" />
            <NavItem to="/payment-collection" icon={CreditCard} label="Payments" />
            <NavItem to="/funnel" icon={Filter} label="Funnel" />
            <NavItem to="/proposals" icon={FileBarChart} label="Proposals" />
            <NavItem to="/demos" icon={Activity} label="Demos" />
            <NavItem to="/partners" icon={Users} label="Partners" />
            <NavItem to="/dc-visits" icon={Building2} label="DC Visits" />
            <NavItem to="/client-visits" icon={MapPin} label="Client Visits" />
            <NavItem to="/events" icon={Calendar} label="Events" />
            <NavItem to="/daily-report" icon={FileText} label="Daily Report" />
          </div>
        </div>
      </nav>

      {children}
      <AIChatbot dashboardData={dashboardData} />
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <Layout>
      <Routes>
        <Route path="/" element={<SalesDashboard />} />
        <Route path="/advanced-analytics" element={<AdvancedDashboard />} />
        <Route path="/advanced-analytics-v2" element={<AdvancedDashboardV2 />} />
        <Route path="/order-booked" element={<ReportPage sheetKey="order_booked" title="Order Booked" />} />
        <Route path="/payment-collection" element={<ReportPage sheetKey="payment_collection" title="Payment Collection" />} />
        <Route path="/funnel" element={<ReportPage sheetKey="funnel" title="Sales Funnel" />} />
        <Route path="/proposals" element={<ReportPage sheetKey="proposal_submitted" title="Proposals Submitted" />} />
        <Route path="/demos" element={<ReportPage sheetKey="demos" title="Demos Conducted" />} />
        <Route path="/partners" element={<ReportPage sheetKey="partner_on_board" title="Partners Onboarded" />} />
        <Route path="/dc-visits" element={<ReportPage sheetKey="dc_visit" title="DC Visits" />} />
        <Route path="/client-visits" element={<ReportPage sheetKey="client_direct_visit" title="Client Direct Visits" />} />
        <Route path="/events" element={<ReportPage sheetKey="events_attend" title="Events Attended" />} />
        <Route path="/daily-report" element={<ReportPage sheetKey="daily_report" title="Daily Report" />} />
      </Routes>
    </Layout>
  </BrowserRouter>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
