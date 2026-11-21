import {Check,X} from "lucide-react";
import {useDashboard} from "../context/DashboardContext";
export default function Toast(){const {notice,clearNotice}=useDashboard();if(!notice)return null;
return <div className="toast" role="status"><span className="toast-check"><Check size={15}/>
</span>{notice}<button onClick={clearNotice} aria-label="Dismiss notification"><X size={15}/></button></div>}
