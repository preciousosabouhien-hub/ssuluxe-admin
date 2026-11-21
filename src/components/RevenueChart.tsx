import {Line,LineChart,CartesianGrid,ResponsiveContainer,Tooltip,XAxis,YAxis} from "recharts";
import {TrendingUp} from "lucide-react";
import {salesData} from "../data/dashboardData";
import {useDashboard} from "../context/DashboardContext";
export default function RevenueChart(){const {dateRange,setDateRange}=useDashboard();
return <section className="card revenue-card"><div className="card-header"><div>
    <h2>Revenue performance</h2><p>Track your revenue through the year</p></div>
    <select value={dateRange} onChange={e=>setDateRange(e.target.value)} aria-label="Chart range">
        <option>This year</option><option>Last 30 days</option><option>Last 7 days</option></select>
        </div><div className="revenue-summary"><div><small>Total revenue</small><strong>$25,319.06</strong>
        </div><div><small>Average / month</small><strong>$2,010.00</strong></div></div>
        <div className="revenue-chart"><ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData} margin={{top:12,right:8,left:-24,bottom:0}}>
                <CartesianGrid strokeDasharray="3 4" vertical={false} stroke="#edf0f3"/>
                <XAxis dataKey="month" tick={{fontSize:10,fill:"#8993a1"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:10,fill:"#8993a1"}} axisLine={false} tickLine={false}/><Tooltip/>
                <Line type="monotone" dataKey="revenue" stroke="#5348c8" strokeWidth={2.5} dot={false}/>
                <Line type="monotone" dataKey="orders" stroke="#12b4c0" strokeWidth={2} dot={false}/>
                </LineChart></ResponsiveContainer></div><div className="chart-foot">
                    <span><i className="legend-line purple"/> Revenue</span>
                    <span><i className="legend-line teal"/> Orders</span>
                    <span className="chart-foot-note"><TrendingUp size={13}/> Revenue is up 12.8%</span></div></section>}
