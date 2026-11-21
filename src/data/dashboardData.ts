import type { Order, WishlistItem } from "../types/dashboard";

// All demonstration content is kept separate from the UI.
export const initialOrders: Order[] = [
 {id:"ORD-1048",item:"Seasonal Delights",customer:"Olivia Martin",date:"Oct 27, 2026",amount:120,status:"Success"},
 {id:"ORD-1047",item:"Medicinal Value Packed",customer:"Ethan Brooks",date:"Oct 26, 2026",amount:89,status:"Cancelled"},
 {id:"ORD-1046",item:"Premium Essentials",customer:"Ava Thompson",date:"Oct 26, 2026",amount:245,status:"Pending"},
 {id:"ORD-1045",item:"Everyday Collection",customer:"Noah Williams",date:"Oct 25, 2026",amount:74,status:"Success"},
 {id:"ORD-1044",item:"Seasonal Delights",customer:"Sophia Davis",date:"Oct 24, 2026",amount:160,status:"Success"}
];
export const initialWishlist: WishlistItem[] = [
 {id:1,item:"Seasonal Delights",status:"Success",price:120,emoji:"🍊"},
 {id:2,item:"Medicinal Value Packed",status:"Cancelled",price:89,emoji:"🥬"},
 {id:3,item:"Premium Essentials",status:"Pending",price:245,emoji:"🫒"}
];
export const salesData = [
 {month:"Jan",revenue:22,orders:16},{month:"Feb",revenue:28,orders:21},{month:"Mar",revenue:24,orders:19},
 {month:"Apr",revenue:36,orders:25},{month:"May",revenue:31,orders:22},{month:"Jun",revenue:44,orders:30},
 {month:"Jul",revenue:39,orders:27},{month:"Aug",revenue:63,orders:42},{month:"Sep",revenue:55,orders:35},
 {month:"Oct",revenue:59,orders:39},{month:"Nov",revenue:46,orders:32},{month:"Dec",revenue:51,orders:40}
];
export const satisfactionData = [
 {name:"Excellent",value:36,color:"#022689"},{name:"Satisfied",value:24,color:"#1274d0"},
 {name:"Poor",value:22,color:"#669ae7"},{name:"Very poor",value:18,color:"#a9c6eb"}
];
export const trafficData = [
 {name:"Direct",percent:42,color:"teal",value:"8,420"},{name:"Social media",percent:28,color:"purple",value:"5,612"},
 {name:"Search engines",percent:19,color:"blue",value:"3,804"},{name:"Referral",percent:11,color:"orange",value:"2,201"}
];
export const metrics = [
 {title:"Total revenue",value:"$25,319",change:"+12.8%",trend:"up",note:"vs. last month",icon:"revenue"},
 {title:"Total orders",value:"142",change:"+8.2%",trend:"up",note:"vs. last month",icon:"orders"},
 {title:"Average order value",value:"$178.80",change:"+4.6%",trend:"up",note:"vs. last month",icon:"average"},
 {title:"Products sold",value:"7,082",change:"-2.4%",trend:"down",note:"vs. last month",icon:"sold"}
] as const;
