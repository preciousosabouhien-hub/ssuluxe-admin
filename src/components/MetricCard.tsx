import {ArrowDownRight,ArrowUpRight,CreditCard,ShoppingBag,Tag,Wallet} from "lucide-react";

const iconMap={revenue:Wallet,
    orders:ShoppingBag,
    average:Tag,
    sold:CreditCard};

    type Metric={title:string;
        value:string;
        change:string;
        trend:"up"|"down";
        note:string;
        icon:keyof typeof iconMap};

export default function MetricCard({metric}:{metric:Metric}){const Icon=iconMap[metric.icon];
    return <section className="card metric-card"><div className="metric-top">
        <span>{metric.title}</span>
        <span className="metric-icon"><Icon size={18}/></span>
        </div><div className="metric-value">{metric.value}</div>
        <div className="metric-bottom">
            <span className={`metric-change ${metric.trend}`}>{metric.trend==="up"?<ArrowUpRight size={13}/>:<ArrowDownRight size={13}/>}
            {metric.change}</span><span>{metric.note}</span></div><div className={`sparkline ${metric.trend}`}>
                <svg viewBox="0 0 120 25" preserveAspectRatio="none" aria-hidden="true">
                    <path d={metric.trend==="up"?"M0 20 C12 18 15 22 25 13 S39 18 49 11 S64 15 74 7 S90 12 100 5 S111 7 120 1":"M0 4 C12 7 18 3 28 10 S42 8 53 13 S68 7 78 16 S96 13 105 21 S115 18 120 24"} fill="none" stroke="currentColor" strokeWidth="2"/></svg>
                    </div></section>}
