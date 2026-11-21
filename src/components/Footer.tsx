import React from "react";

// Footer component displayed at the bottom of the dashboard. 

export default function Footer(): JSX.Element
{
    const currentYear = new Date().getFullYear();
    
    return(
<footer className="footer"><span>© 2026 ReactBoard. All rights reserved.</span>
<div><a href="#privacy">Privacy</a><a href="#terms">Terms</a><a href="#support">Support</a></div></footer> 
 ) 
}
