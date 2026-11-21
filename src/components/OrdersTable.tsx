import {useState} from "react";
import {ChevronLeft,ChevronRight,Filter,MoreHorizontal,Search} from "lucide-react";
import {useDashboard} from "../context/DashboardContext";
export default function OrdersTable(){const {filteredOrders,searchQuery,setSearchQuery,showNotice}=useDashboard();
const [showAll,setShowAll]=useState(false);const rows=showAll?filteredOrders:filteredOrders.slice(0,4);
return <section className="card orders-card"><div className="card-header orders-header">
    <div><h2>Recent orders</h2><p>A quick look at your latest transactions</p></div>
    <div className="table-actions"><label className="table-search"><Search size={14}/>
    <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Filter orders"/></label>
    <button className="button button-secondary button-compact" onClick={()=>showNotice("Filters panel is a demo placeholder")}>
<Filter size={14}/> Filters</button>
<button className="button button-secondary button-compact" onClick={()=>setShowAll(!showAll)}>{showAll?"Show less":"View all"} <ChevronRight size={14}/>
</button></div></div><div className="table-wrap"><table><thead><tr><th><input type="checkbox" aria-label="Select all orders"/></th><th>Order ID</th><th>Product</th>
<th>Customer</th><th>Date</th><th>Amount</th><th>Status</th><th/></tr></thead>
<tbody>{rows.map(o=><tr key={o.id}><td><input type="checkbox" aria-label={`Select ${o.id}`}/></td><td><span className="order-id">{o.id}</span></td>
<td>
    <div className="product-cell">
        <span className="product-thumb">{o.item.startsWith("Seasonal")?"🍊":o.item.startsWith("Medicinal")?"🥬":o.item.startsWith("Premium")?"🫒":"🧺"}</span>
        <span>{o.item}</span></div></td><td><div className="customer-cell"><span className="tiny-avatar">{o.customer.split(" ").map(s=>s[0]).join("")}
            </span>{o.customer}</div></td><td className="date-cell">{o.date}</td><td className="amount-cell">${o.amount.toLocaleString("en-US")}</td>
            <td><span className={`status status-${o.status.toLowerCase()}`}><i/>{o.status}</span></td>
            <td><button className="icon-button row-more" aria-label={`Review ${o.id}`} onClick={()=>showNotice(`${o.id} selected for review`)}>
                <MoreHorizontal size={17}/></button></td></tr>)}{rows.length===0&&<tr><td colSpan={8} className="empty-state">No orders match “{searchQuery}”.</td>
                </tr>}</tbody></table></div><div className="table-footer"><span>Showing <strong>{rows.length}</strong> of 
                <strong>{filteredOrders.length}</strong> orders</span><div className="pagination">
                    <button className="page-arrow" aria-label="Previous page" onClick={()=>showNotice("You are on the first page")}><ChevronLeft size={15}/></button>
                    <button className="page-number selected">1</button><button className="page-number" onClick={()=>setShowAll(true)}>2</button>
                    <button className="page-number" onClick={()=>setShowAll(true)}>3</button>
                    <span>…</span>
                    <button className="page-number" onClick={()=>setShowAll(true)}>12</button>
                    <button className="page-arrow" aria-label="Next page" onClick={()=>setShowAll(true)}><ChevronRight size={15}/></button></div></div></section>}
