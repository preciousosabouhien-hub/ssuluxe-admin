import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { initialOrders, initialWishlist } from "../data/dashboardData";
import type { Order, WishlistItem } from "../types/dashboard";

interface DashboardState {
 activePage: string; setActivePage: (value:string)=>void;
 searchQuery: string; setSearchQuery: (value:string)=>void;
 dateRange: string; setDateRange: (value:string)=>void;
 filteredOrders: Order[]; wishlist: WishlistItem[];
 removeWishlistItem: (id:number)=>void;
 notice: string; showNotice: (message:string)=>void; clearNotice: ()=>void;
}
const DashboardContext = createContext<DashboardState | null>(null);

// Context shares navigation, search, chart settings, wishlist and toast state.
export function DashboardProvider({children}:{children:ReactNode}) {
 const [activePage,setActivePage]=useState("Overview");
 const [searchQuery,setSearchQuery]=useState("");
 const [dateRange,setDateRange]=useState("This year");
 const [orders]=useState(initialOrders);
 const [wishlist,setWishlist]=useState(initialWishlist);
 const [notice,setNotice]=useState("");
 const filteredOrders=useMemo(()=>orders.filter(o=>[o.id,o.item,o.customer,o.status].join(" ").toLowerCase().includes(searchQuery.toLowerCase())),[orders,searchQuery]);
 const removeWishlistItem=(id:number)=>{setWishlist(items=>items.filter(item=>item.id!==id));setNotice("Item removed from your wishlist");};
 const value={activePage,setActivePage,searchQuery,setSearchQuery,dateRange,setDateRange,filteredOrders,wishlist,removeWishlistItem,notice,showNotice:setNotice,clearNotice:()=>setNotice("")};
 return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}
export function useDashboard(){const value=useContext(DashboardContext);if(!value)throw new Error("useDashboard must be used inside DashboardProvider");return value;}
