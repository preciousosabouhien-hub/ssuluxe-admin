import {Bar,BarChart,CartesianGrid,Cell,Pie,PieChart,ResponsiveContainer,Tooltip,XAxis,YAxis} from "recharts";
import {MoreHorizontal,TrendingUp} from "lucide-react";
import {salesData,satisfactionData,trafficData} from "../data/dashboardData";
import {useDashboard} from "../context/DashboardContext";
export function SalesActivityChart(){const {showNotice}=useDashboard();return <section className="card trend-card">

    <div className="card-header">
        <div><h2>Sales activity</h2><p>Order volume across the year</p></div>
    <button className="icon-button small" onClick={()=>showNotice("Sales options opened (demo)")} aria-label="Sales options"><MoreHorizontal size={18}/></button>
    </div><div className="sales-chart"><ResponsiveContainer width="100%" height="100%">

        <BarChart data={salesData} margin={{top:12,right:4,left:-24,bottom:0}}>

<CartesianGrid strokeDasharray="3 4" vertical={false} stroke="#edf0f3"/>

<XAxis dataKey="month" tick={{fontSize:10,fill:"#8993a1"}} axisLine={false} tickLine={false}/>

<YAxis tick={{fontSize:10,fill:"#8993a1"}} axisLine={false} tickLine={false}/>

<Tooltip/><Bar dataKey="orders" fill="#022689" radius={[4,4,0,0]} barSize={12}/></BarChart></ResponsiveContainer>
</div>
<div className="mini-stats">
    <div><small>Orders this month</small><strong>1,284</strong></div><div><small>Conversion rate</small><strong>3.86% <span className="positive">↑ 0.6%</span></strong></div>
    </div></section>}

export function CustomerSatisfaction(){const {showNotice}=useDashboard();
return <section className="card satisfaction-card"><div className="card-header">
    <div><h2>Customer satisfaction</h2>
<p>Feedback from your customers</p></div>
<button className="icon-button small" onClick={()=>showNotice("Customer report options opened")} aria-label="Satisfaction options">
    <MoreHorizontal size={18}/>
    </button></div>
    <div className="satisfaction-body">
        <div className="donut-wrap"><ResponsiveContainer width="100%" height="100%">
        <PieChart><Pie data={satisfactionData} dataKey="value" nameKey="name" innerRadius="56%" outerRadius="82%" paddingAngle={2} stroke="none">
            {satisfactionData.map(s=><Cell key={s.name} fill={s.color}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer>
            <div className="donut-center"><strong>94.2%</strong>
            <small>Satisfaction</small>
            </div></div>
            <div className="legend-list">{satisfactionData.map(s=><div key={s.name}><span><i style={{background:s.color}}/>{s.name}</span>
            <strong>{s.value}%</strong>
            </div>)}
            </div></div>
            <div className="satisfaction-footer">
                <span className="positive"><TrendingUp size={14}/> 6.4%</span> improvement in customer happiness</div></section>}
export function TrafficSources(){const {showNotice}=useDashboard();return <section className="card channel-card">
    <div className="card-header"><div><h2>Traffic sources</h2><p>Where your visitors come from</p></div>
    <button className="icon-button small" onClick={()=>showNotice("Traffic source options opened")} aria-label="Traffic options"><MoreHorizontal size={18}/></button>
    </div>
    <div className="traffic-list">{trafficData.map(t=><div className="traffic-row" key={t.name}><div className="traffic-meta"><span><i className={`traffic-dot ${t.color}`}/>
    {t.name}</span><strong>{t.value}</strong></div>
    <div className="progress-track"><span className={t.color} style={{width:`${t.percent}%`}}/></div>
    <small>{t.percent}% of total visitors</small></div>)}</div></section>}
