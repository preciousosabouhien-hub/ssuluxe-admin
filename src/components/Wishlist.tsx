import {ChevronRight,Pencil,Trash2} from "lucide-react";
import {useDashboard} from "../context/DashboardContext";
export default function Wishlist(){const {wishlist,removeWishlistItem,showNotice}=useDashboard();return <section className="card wishlist-card">
    <div className="card-header"><div><h2>My wishlist</h2><p>Products you’ve saved for later</p></div>
    <button className="button button-secondary button-compact" onClick={()=>showNotice("Wishlist management is a demo placeholder")}>Manage wishlist <ChevronRight size={14}/>
    </button></div>
    <div className="wishlist-list">{wishlist.map(item=><div className="wish-row" key={item.id}><div className="wish-product"><span className="wish-thumb">{item.emoji}</span>
    <div><strong>{item.item}</strong><small>SKU-00{item.id}42</small></div></div><span className={`status status-${item.status.toLowerCase()}`}><i/>{item.status}</span>
    <strong className="wish-price">${item.price.toLocaleString("en-US")}</strong><div className="wish-actions">
        <button aria-label={`Edit ${item.item}`} onClick={()=>showNotice(`${item.item} is ready to edit`)}><Pencil size={15}/></button>
        <button aria-label={`Remove ${item.item}`} onClick={()=>removeWishlistItem(item.id)}><Trash2 size={15}/></button>
        </div></div>)}{wishlist.length===0&&<div className="empty-state">Your wishlist is empty.</div>}</div></section>}
