import { NavLink, useLocation } from 'react-router-dom';
import { CarFront, Fuel, Route, ChartNoAxesCombined } from 'lucide-react';
const links = [
  {to:'/vehicles', label:'Vehicles', Icon:CarFront},
  {to:'/entries', label:'Fuel', Icon:Fuel},
  {to:'/trips', label:'Trips', Icon:Route},
  {to:'/analytics', label:'Analytics', Icon:ChartNoAxesCombined},
];
export default function BottomNav(){
  const {pathname}=useLocation();
  return <nav className="pk-bottom-nav" aria-label="Mobile primary navigation">
    {links.map(({to,label,Icon})=><NavLink key={to} to={to} className={({isActive})=>`pk-bottom-link ${isActive || (to==='/vehicles' && pathname.startsWith('/vehicles/'))?'active':''}`}>
      <Icon size={21} strokeWidth={1.85} aria-hidden="true"/><span>{label}</span>
    </NavLink>)}
  </nav>;
}
