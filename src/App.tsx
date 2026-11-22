import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import PageHeader from "./components/PageHeader";
import MetricCard from "./components/MetricCard";
import RevenueChart from "./components/RevenueChart";
import {SalesActivityChart,CustomerSatisfaction,TrafficSources,} from "./components/AnalyticsCards";
import OrdersTable from "./components/OrdersTable";
import Wishlist from "./components/Wishlist";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import Products from "./components/Products";
import { metrics } from "./data/dashboardData";
import { useDashboard } from "./context/DashboardContext";

function OverviewPage() {
return (
<>
{metrics.map((metric) => (
<MetricCard key={metric.icon} metric={{...metric, trend: metric.trend as "up" | "down"}} />
))}
    <RevenueChart />

  <div className="middle-grid">
    <SalesActivityChart />
    <CustomerSatisfaction />
    <TrafficSources />
  </div>
  <OrdersTable />
  <Wishlist />
</> ); }

function PlaceholderPage({ title, description}: {
title: string; description: string; }) {
return (
<section className="card" style={{ padding: "32px" }}>
{title}
<p style={{ marginTop: "10px", color: "#777" }}>
{description} </p>
</section>
);
}

export default function App() {
const [sidebarOpen, setSidebarOpen] = useState(false);
const { activePage } = useDashboard();

const renderPage = () => {
switch (activePage) {
case "Overview":
return <OverviewPage/> ;

  case "Products":
    return (
      <Products />
    );
  case "Analytics":
    return (
      <PlaceholderPage
        title="Analytics"
        description="Your store analytics will appear here."
      />
    );
  case "Customers":
    return (
      <PlaceholderPage
        title="Customers"
        description="View and manage your store customers here."
      />
    );
  case "Orders Report":
    return (
      <PlaceholderPage
        title="Orders Management"
        description="View and manage customer orders here."
      />
    );
  case "Sales Report":
    return (
      <PlaceholderPage
        title="Sales Reports"
        description="Your sales reports will appear here."
      />
    );
  case "Payment Report":
    return (
      <PlaceholderPage
        title="Payment Reports"
        description="Your payment records will appear here."
      />
    );
  default:
    return (
      <PlaceholderPage
        title={activePage}
        description="This section is being prepared."
      />
    );
}

};

return (
    <div className="app-shell">
<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

  <main className="main-area">
    <Topbar onMenuClick={() => setSidebarOpen(true)} />
    <div className="page-content">
      
      <PageHeader />
      {renderPage()}
      <Footer />
    </div>
    </main>
     <Toast />

  </div>
 
);
}