import {Download} from "lucide-react";
import {useDashboard} from "../context/DashboardContext";
export default function PageHeader(){const {activePage,showNotice}=useDashboard();
return <div className="page-heading"><div><div className="eyebrow">
    <span className="live-dot"/> LIVE OVERVIEW</div><h1>{activePage==="Overview"?"Dashboard overview":activePage}</h1>
    <p className="page-subtitle">Here’s what’s happening with your store today.</p></div><div className="heading-actions">
        <button className="button button-secondary" onClick={()=>showNotice("Your report is ready to export")}>
            <Download size={15}/> Export</button><button className="button button-primary" onClick={()=>showNotice("New report created (demo)")}>
                <span>＋</span> Create report</button></div></div>}
