import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import SalesDashboard from './SalesDashboard';
import ReportPage from './pages/ReportPage';
import AdvancedDashboard from './pages/AdvancedDashboard';
import AdvancedDashboardV2 from './pages/AdvancedDashboardV2';
import AIChatbot from './components/AIChatbot';
import { LayoutDashboard, FileText, CreditCard, Filter, Users, Building2, MapPin, Calendar, Activity, FileBarChart, BarChart3, Settings, ChevronDown, Menu, X as CloseIcon, ChevronRight } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [expandedMenu, setExpandedMenu] = React.useState('');

  const menuItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    {
      label: 'Analytics', icon: BarChart3, children: [
        { to: '/advanced-analytics', label: 'Analytics V1', icon: BarChart3 },
        { to: '/advanced-analytics-v2', label: 'Analytics V2', icon: Settings }
      ]
    },
    {
      label: 'Data', icon: FileText, children: [
        { to: '/order-booked', label: 'Orders', icon: FileText },
        { to: '/payment-collection', label: 'Payments', icon: CreditCard },
        { to: '/funnel', label: 'Funnel', icon: Filter },
        { to: '/proposals', label: 'Proposals', icon: FileBarChart },
        { to: '/demos', label: 'Demos', icon: Activity },
        { to: '/partners', label: 'Partners', icon: Users },
        { to: '/dc-visits', label: 'DC Visits', icon: Building2 },
        { to: '/client-visits', label: 'Client Visits', icon: MapPin },
        { to: '/events', label: 'Events', icon: Calendar },
        { to: '/daily-report', label: 'Daily Report', icon: FileText }
      ]
    }
  ];

  const toggleMenu = (label) => {
    setExpandedMenu(expandedMenu === label ? '' : label);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[10000] p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        {isOpen ? <CloseIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]" onClick={() => setIsOpen(false)} />
      )}

      <div className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-[10000] transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <h2 className="text-xl font-bold">Sales Dashboard</h2>
          <p className="text-sm text-indigo-100 mt-1">Navigation Menu</p>
        </div>

        <nav className="p-4 overflow-y-auto h-[calc(100vh-120px)]">
          {menuItems.map((item, idx) => (
            <div key={idx} className="mb-2">
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.label)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 transition-all duration-200 font-medium"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${expandedMenu === item.label ? 'rotate-90' : ''}`} />
                  </button>
                  {expandedMenu === item.label && (
                    <div className="ml-4 mt-1 space-y-1 animate-fadeIn">
                      {item.children.map((child, childIdx) => (
                        <NavLink
                          key={childIdx}
                          to={child.to}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${location.pathname === child.to
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                          <child.icon className="w-4 h-4" />
                          <span>{child.label}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${location.pathname === item.to
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-indigo-50'
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
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
      <Sidebar />
      <div className="px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">
        {children}
      </div>
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
