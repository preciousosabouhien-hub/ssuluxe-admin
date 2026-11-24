import {Download} from "lucide-react";
import {useDashboard} from "../context/DashboardContext";
export default function PageHeader(){const {activePage,showNotice}=useDashboard();
return <div className="page-heading"><div className="eyebrow">
    <span className="live-dot"/> LIVE OVERVIEW</div><div className="heading-actions">
        <button className="button button-secondary" onClick={()=>showNotice("Your report is ready to export")}>
            <Download size={15}/> Export</button><button className="button button-primary" onClick={()=>showNotice("New report created (demo)")}>
                <span>＋</span> Create report</button></div></div>}
