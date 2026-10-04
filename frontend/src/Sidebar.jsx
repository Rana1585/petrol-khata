import { NavLink, useLocation } from "react-router-dom";
import { CarFront, Fuel, Route, ChartNoAxesCombined, X, Gauge } from "lucide-react";

const items = [
  { label: "Vehicles", path: "/vehicles", Icon: CarFront },
  { label: "Fuel Entries", path: "/entries", Icon: Fuel },
  { label: "Trips", path: "/trips", Icon: Route },
  { label: "Analytics", path: "/analytics", Icon: ChartNoAxesCombined },
];

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const { pathname } = useLocation();
  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`} aria-label="Main navigation">
      <div className="sidebar-inner">
        <div className="sidebar-header">
          <NavLink to="/vehicles" className="sidebar-brand" onClick={onClose} aria-label="Petrol Khata">
            <span className="sidebar-logo"><Fuel size={24} strokeWidth={1.9} /></span>
            <span className="sidebar-brand-text"><strong>Petrol Khata</strong><small>Fuel management</small></span>
          </NavLink>
          <button type="button" className="sidebar-close-button" onClick={onClose} aria-label="Close navigation"><X size={20} /></button>
        </div>

        <nav className="sidebar-nav" aria-label="Workspace">
          <span className="sidebar-section-title">Workspace</span>
          <div className="sidebar-section-links">
            {items.map(({ label, path, Icon }) => {
              const active = pathname === path || (path === "/vehicles" && pathname.startsWith("/vehicles/"));
              return (
                <NavLink key={path} to={path} onClick={onClose} title={label}
                  className={() => `sidebar-link ${active ? "active" : ""}`}>
                  <span className="sidebar-icon"><Icon size={21} strokeWidth={1.8} /></span>
                  <span className="sidebar-link-label">{label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="sidebar-spacer" />
        <div className="sidebar-footer">
          <div className="sidebar-footer-card">
            <span className="sidebar-footer-icon"><Gauge size={19} strokeWidth={1.8} /></span>
            <span className="sidebar-footer-content"><strong>Drive smarter</strong><small>Everything organized.</small></span>
          </div>
        </div>
      </div>
    </aside>
  );
}
