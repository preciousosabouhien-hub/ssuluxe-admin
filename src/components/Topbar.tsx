import {Bell,ChevronDown,ChevronRight,Menu,Search} from "lucide-react";
import {useDashboard} from "../context/DashboardContext";
export default function Topbar({onMenuClick}:{onMenuClick:()=>void}){
 const {activePage,searchQuery,setSearchQuery,showNotice}=useDashboard();
 return <header className="topbar"><button className="icon-button mobile-menu" onClick={onMenuClick} aria-label="Open navigation">
    <Menu size={20}/></button><div className="breadcrumbs"><span>Workspace</span><ChevronRight size={14}/>
    <strong>{activePage}</strong></div><div className="top-actions"><label className="top-search">
        <Search size={16}/><input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search orders..."/>
        <kbd>⌘ K</kbd></label><button className="icon-button notification-button" aria-label="Notifications" onClick={()=>showNotice("You're all caught up")}>
            <Bell size={18}/><i/></button><div className="profile"><div className="avatar avatar-purple">BF</div><div className="profile-copy">
                <strong>Bill Ford</strong><small>Administrator</small></div><ChevronDown size={14}/></div></div></header>;
}