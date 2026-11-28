import { Activity,BarChart3,ChevronDown,ChevronRight,CircleHelp,CreditCard,FileText,LayoutDashboard,PackageCheck,Settings,ShoppingBag,Users,X } from "lucide-react";

import { useDashboard } from "../context/DashboardContext";

const groups=[{label:"WORKSPACE",items:[{name:"Overview",icon:LayoutDashboard},
    {name:"Analytics",icon:BarChart3},{name:"Customers",icon:Users},
    {name:"Products",icon:PackageCheck}]},{label:"REPORTS",items:[{name:"Orders Report",icon:ShoppingBag},
        {name:"Sales Report",icon:FileText},{name:"Payment Report",icon:CreditCard}]}];
        
export default function Sidebar({open,onClose}:{open:boolean;onClose:()=>void}){
 const {activePage,setActivePage,showNotice}=useDashboard();
 return <>
         {open&&<button className="mobile-scrim" aria-label="Close navigation" onClick={onClose}/>}
 <aside className={`sidebar ${open?"sidebar-open":""}`}>
 <div className="brand">
    <div className="brand-mark">  </div>
    <span>Ssuxu <span className="brand-light">Luxe</span></span>
 <button className="mobile-close" onClick={onClose} aria-label="Close"><X size={18}/></button></div>
 <nav>{groups.map(group=><div className="nav-group" key={group.label}><p className="nav-label">{group.label}
    </p>{group.items.map(item=>{const Icon=item.icon;
        return <button key={item.name} className={`nav-item ${activePage===item.name?"active":""}`} onClick={()=>{setActivePage(item.name);onClose();}}>
            <Icon size={17}/><span>
                {item.name}</span>{item.name==="Orders Report"&&<span className="nav-count">12
                </span>}{item.name==="Overview"&&<ChevronRight className="nav-chevron" size={14}/>}</button>})}
                </div>)}</nav>
                
 <div className="sidebar-bottom"><button className="nav-item" onClick={()=>showNotice("Settings are a demo placeholder")}><Settings size={17}/>
 <span>Settings</span></button><div className="sidebar-user"><div className="avatar avatar-purple">MO</div>
  <div className="profile-copy">
        <small>Administrator</small>
      </div></div></div>
 </aside>
 </>;
}