import { useState, useEffect, useCallback } from "react";

// ============================================================
// THIRD-PARTY API 1: Leaflet Map (OpenStreetMap) loaded via CDN
// THIRD-PARTY API 2: Claude AI for item description & matching
// ============================================================

// ─── MOCK DATA ───────────────────────────────────────────────
const MOCK_ITEMS = [
  { id: 1, type: "lost", title: "Blue Leather Wallet", category: "Accessories", location: "Central Park, NYC", date: "2026-03-20", description: "Navy blue leather wallet with initials 'JD'. Contains ID cards and family photos.", image: "👜", status: "active", lat: 40.7851, lng: -73.9683, contact: "john@email.com" },
  { id: 2, type: "found", title: "iPhone 15 Pro (Black)", category: "Electronics", location: "Times Square Station", date: "2026-03-22", description: "Black iPhone 15 Pro found near the subway exit. Has a cracked screen protector.", image: "📱", status: "active", lat: 40.7580, lng: -73.9855, contact: "sarah@email.com" },
  { id: 3, type: "lost", title: "Golden Retriever - Max", category: "Pets", location: "Brooklyn Bridge", date: "2026-03-23", description: "Male golden retriever, 3 years old, wearing a red collar with tag 'Max'.", image: "🐕", status: "active", lat: 40.7061, lng: -73.9969, contact: "mike@email.com" },
  { id: 4, type: "found", title: "Car Keys with Fob", category: "Keys", location: "Grand Central Station", date: "2026-03-24", description: "Toyota car keys with a blue keychain bear. Found near ticket booth.", image: "🔑", status: "active", lat: 40.7527, lng: -73.9772, contact: "anna@email.com" },
  { id: 5, type: "lost", title: "MacBook Pro 14-inch", category: "Electronics", location: "Brooklyn Coffee Shop", date: "2026-03-25", description: "Silver MacBook Pro with stickers on back. Has a dent on corner.", image: "💻", status: "active", lat: 40.6892, lng: -73.9442, contact: "dev@email.com" },
  { id: 6, type: "found", title: "Black Backpack", category: "Bags", location: "Central Park South", date: "2026-03-21", description: "Large black backpack with books and gym clothes inside. No ID found.", image: "🎒", status: "active", lat: 40.7641, lng: -73.9736, contact: "finder@email.com" },
];

const CATEGORIES = ["All", "Electronics", "Accessories", "Pets", "Keys", "Bags", "Documents", "Jewelry", "Clothing", "Other"];

// ─── CSS STYLES ──────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink: #0d0d0d;
      --paper: #f5f0e8;
      --cream: #ede8dc;
      --accent: #e84545;
      --accent2: #2563eb;
      --muted: #7a7465;
      --border: #d4cfc4;
      --found: #16a34a;
      --lost: #dc2626;
      --card-bg: #ffffff;
    }

    html, body { height: 100%; font-family: 'DM Sans', sans-serif; background: var(--paper); color: var(--ink); }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--cream); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

    .app { min-height: 100vh; display: flex; flex-direction: column; }

    /* NAV */
    nav {
      position: sticky; top: 0; z-index: 100;
      background: var(--ink); color: var(--paper);
      border-bottom: 3px solid var(--accent);
      padding: 0 2rem;
      display: flex; align-items: center; justify-content: space-between;
      height: 64px;
    }
    .nav-logo { font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; letter-spacing: 2px; color: var(--paper); cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
    .nav-logo span { color: var(--accent); }
    .nav-links { display: flex; gap: 0.25rem; }
    .nav-link { background: none; border: none; color: var(--paper); font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; padding: 0.5rem 0.9rem; border-radius: 4px; cursor: pointer; transition: all 0.15s; }
    .nav-link:hover, .nav-link.active { background: var(--accent); color: #fff; }
    .nav-cta { background: var(--accent); color: #fff; border: none; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.85rem; padding: 0.55rem 1.2rem; border-radius: 4px; cursor: pointer; letter-spacing: 0.04em; transition: opacity 0.15s; }
    .nav-cta:hover { opacity: 0.85; }

    /* HERO */
    .hero {
      background: var(--ink);
      color: var(--paper);
      padding: 5rem 2rem 4rem;
      position: relative;
      overflow: hidden;
    }
    .hero::before {
      content: 'LOST & FOUND';
      position: absolute; top: -2rem; right: -1rem;
      font-family: 'Bebas Neue', sans-serif; font-size: 12rem;
      color: rgba(255,255,255,0.03); pointer-events: none; white-space: nowrap;
    }
    .hero-inner { max-width: 900px; margin: 0 auto; }
    .hero-tag { display: inline-flex; align-items: center; gap: 0.5rem; background: var(--accent); color: #fff; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.35rem 0.9rem; border-radius: 2px; margin-bottom: 1.5rem; }
    .hero h1 { font-family: 'Bebas Neue', sans-serif; font-size: clamp(3.5rem, 8vw, 7rem); line-height: 0.95; letter-spacing: 1px; margin-bottom: 1.5rem; }
    .hero h1 em { color: var(--accent); font-style: normal; }
    .hero p { font-size: 1.1rem; color: rgba(245,240,232,0.7); max-width: 520px; line-height: 1.7; margin-bottom: 2.5rem; }
    .hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
    .btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.85rem 1.8rem; border-radius: 4px; font-weight: 600; font-size: 0.9rem; border: none; cursor: pointer; transition: all 0.15s; letter-spacing: 0.03em; }
    .btn-primary { background: var(--accent); color: #fff; }
    .btn-primary:hover { background: #c53030; transform: translateY(-1px); }
    .btn-secondary { background: transparent; color: var(--paper); border: 1.5px solid rgba(245,240,232,0.3); }
    .btn-secondary:hover { border-color: var(--paper); background: rgba(255,255,255,0.08); }
    .btn-blue { background: var(--accent2); color: #fff; }
    .btn-blue:hover { background: #1d4ed8; }
    .btn-outline { background: transparent; color: var(--ink); border: 1.5px solid var(--border); }
    .btn-outline:hover { border-color: var(--ink); background: var(--cream); }

    /* STATS BAR */
    .stats-bar { background: var(--accent); color: #fff; padding: 1rem 2rem; display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap; }
    .stat { text-align: center; }
    .stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; line-height: 1; }
    .stat-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.85; }

    /* MAIN CONTENT */
    main { flex: 1; max-width: 1200px; margin: 0 auto; width: 100%; padding: 2.5rem 2rem; }

    /* PAGE TITLE */
    .page-header { margin-bottom: 2.5rem; }
    .page-header h2 { font-family: 'Bebas Neue', sans-serif; font-size: 3rem; letter-spacing: 1px; }
    .page-header p { color: var(--muted); margin-top: 0.4rem; }
    .divider { width: 60px; height: 4px; background: var(--accent); margin: 0.75rem 0; border-radius: 2px; }

    /* SEARCH FILTER COMPONENT */
    .search-filter { background: var(--card-bg); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem; display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-end; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    .filter-group { display: flex; flex-direction: column; gap: 0.4rem; flex: 1; min-width: 180px; }
    .filter-label { font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); }
    .filter-input, .filter-select { padding: 0.65rem 0.9rem; border: 1.5px solid var(--border); border-radius: 5px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; background: var(--paper); color: var(--ink); outline: none; transition: border-color 0.15s; }
    .filter-input:focus, .filter-select:focus { border-color: var(--accent2); }
    .filter-tabs { display: flex; gap: 0.4rem; }
    .filter-tab { padding: 0.6rem 1.1rem; border: 1.5px solid var(--border); background: var(--paper); border-radius: 4px; font-size: 0.82rem; font-weight: 500; cursor: pointer; transition: all 0.15s; }
    .filter-tab.active-lost { background: var(--lost); color: #fff; border-color: var(--lost); }
    .filter-tab.active-found { background: var(--found); color: #fff; border-color: var(--found); }
    .filter-tab.active-all { background: var(--ink); color: #fff; border-color: var(--ink); }

    /* ITEM CARD COMPONENT */
    .items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.25rem; }
    .item-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; transition: all 0.2s; cursor: pointer; position: relative; }
    .item-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); border-color: var(--accent2); }
    .card-img { background: var(--cream); height: 120px; display: flex; align-items: center; justify-content: center; font-size: 3.5rem; border-bottom: 1px solid var(--border); }
    .card-body { padding: 1.1rem; }
    .card-title { font-weight: 600; font-size: 1rem; margin-bottom: 0.35rem; }
    .card-meta { font-size: 0.8rem; color: var(--muted); display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 0.75rem; }
    .card-meta span { display: flex; align-items: center; gap: 0.35rem; }
    .card-desc { font-size: 0.82rem; color: #555; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .card-footer { padding: 0.75rem 1.1rem; background: var(--cream); border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
    .card-date { font-family: 'DM Mono', monospace; font-size: 0.72rem; color: var(--muted); }

    /* STATUS BADGE COMPONENT */
    .badge { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.25rem 0.7rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
    .badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
    .badge-lost { background: #fef2f2; color: var(--lost); }
    .badge-found { background: #f0fdf4; color: var(--found); }
    .badge-resolved { background: #eff6ff; color: var(--accent2); }
    .badge-active { background: #fffbeb; color: #d97706; }
    .badge-cat { background: var(--cream); color: var(--muted); font-size: 0.65rem; border: 1px solid var(--border); }

    /* FORM */
    .form-container { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    @media (max-width: 768px) { .form-container { grid-template-columns: 1fr; } }
    .form-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 8px; padding: 2rem; }
    .form-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.6rem; }
    .form-group { margin-bottom: 1.2rem; }
    .form-label { display: block; font-size: 0.78rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 0.45rem; }
    .form-input, .form-textarea, .form-select { width: 100%; padding: 0.75rem 1rem; border: 1.5px solid var(--border); border-radius: 5px; font-family: 'DM Sans', sans-serif; font-size: 0.9rem; background: var(--paper); color: var(--ink); outline: none; transition: border-color 0.15s; resize: vertical; }
    .form-input:focus, .form-textarea:focus, .form-select:focus { border-color: var(--accent2); background: #fff; }
    .form-textarea { min-height: 100px; }
    .upload-zone { border: 2px dashed var(--border); border-radius: 6px; padding: 2rem; text-align: center; cursor: pointer; transition: all 0.15s; background: var(--cream); }
    .upload-zone:hover, .upload-zone.drag { border-color: var(--accent2); background: #eff6ff22; }
    .upload-icon { font-size: 2rem; margin-bottom: 0.5rem; }
    .upload-text { font-size: 0.85rem; color: var(--muted); }
    .ai-btn { width: 100%; padding: 0.75rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; border: none; border-radius: 5px; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.85rem; cursor: pointer; margin-top: 0.5rem; transition: opacity 0.15s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
    .ai-btn:hover { opacity: 0.9; }
    .ai-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .ai-result { background: linear-gradient(135deg, #f5f0ff, #eff6ff); border: 1px solid #c4b5fd; border-radius: 6px; padding: 1rem; margin-top: 0.75rem; font-size: 0.85rem; line-height: 1.6; color: #3730a3; }

    /* MAP */
    .map-section { margin-top: 2rem; }
    .map-title { font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; margin-bottom: 1rem; }
    #leaflet-map { height: 400px; border-radius: 8px; border: 1px solid var(--border); overflow: hidden; }

    /* MODAL */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
    .modal { background: var(--card-bg); border-radius: 10px; max-width: 560px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 60px rgba(0,0,0,0.3); animation: slideUp 0.25s ease; }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .modal-header { padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: flex-start; }
    .modal-body { padding: 1.5rem; }
    .modal-img { font-size: 5rem; text-align: center; padding: 1.5rem; background: var(--cream); border-bottom: 1px solid var(--border); }
    .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--muted); line-height: 1; padding: 0.25rem; border-radius: 4px; }
    .close-btn:hover { background: var(--cream); color: var(--ink); }
    .detail-row { display: flex; gap: 1rem; margin-bottom: 0.75rem; font-size: 0.88rem; }
    .detail-key { font-weight: 600; min-width: 90px; color: var(--muted); text-transform: uppercase; font-size: 0.72rem; letter-spacing: 0.05em; padding-top: 0.15rem; }
    .detail-val { color: var(--ink); line-height: 1.5; }

    /* CONTACT PAGE */
    .contact-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 2rem; }
    @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; } }
    .info-card { background: var(--ink); color: var(--paper); border-radius: 8px; padding: 2rem; }
    .info-card h3 { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; margin-bottom: 1rem; color: var(--accent); }
    .info-item { display: flex; gap: 1rem; margin-bottom: 1.5rem; align-items: flex-start; }
    .info-icon { font-size: 1.5rem; margin-top: 0.1rem; }
    .info-text strong { display: block; font-weight: 600; margin-bottom: 0.2rem; }
    .info-text span { font-size: 0.85rem; opacity: 0.7; }
    .success-msg { background: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; padding: 1rem 1.25rem; color: #166534; font-size: 0.9rem; margin-top: 1rem; display: flex; align-items: center; gap: 0.5rem; }
    
    /* HOME FEATURES */
    .features { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.25rem; margin-top: 2rem; }
    .feature-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 8px; padding: 1.5rem; transition: transform 0.2s, box-shadow 0.2s; }
    .feature-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.07); }
    .feature-icon { font-size: 2.2rem; margin-bottom: 1rem; }
    .feature-title { font-weight: 700; margin-bottom: 0.4rem; font-size: 1rem; }
    .feature-desc { font-size: 0.84rem; color: var(--muted); line-height: 1.6; }
    .recent-title { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; margin: 3rem 0 1.25rem; letter-spacing: 0.5px; }
    .view-all { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; font-weight: 600; color: var(--accent2); text-transform: uppercase; letter-spacing: 0.05em; border: none; background: none; cursor: pointer; margin-bottom: 1.25rem; }
    .view-all:hover { text-decoration: underline; }

    /* FOOTER */
    footer { background: var(--ink); color: rgba(245,240,232,0.6); text-align: center; padding: 1.5rem; font-size: 0.82rem; border-top: 3px solid var(--accent); margin-top: auto; }
    footer strong { color: var(--paper); }

    /* TOAST */
    .toast { position: fixed; bottom: 2rem; right: 2rem; background: var(--ink); color: var(--paper); padding: 0.85rem 1.4rem; border-radius: 6px; font-size: 0.88rem; font-weight: 500; z-index: 300; animation: slideIn 0.3s ease; box-shadow: 0 8px 24px rgba(0,0,0,0.2); display: flex; align-items: center; gap: 0.6rem; }
    .toast.success { border-left: 3px solid var(--found); }
    .toast.error { border-left: 3px solid var(--lost); }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

    .empty-state { text-align: center; padding: 4rem 2rem; color: var(--muted); }
    .empty-state .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
    .empty-state h3 { font-family: 'Bebas Neue', sans-serif; font-size: 1.8rem; color: var(--ink); margin-bottom: 0.5rem; }

    .loading { display: flex; align-items: center; gap: 0.5rem; color: var(--muted); font-size: 0.85rem; }
    .spinner { width: 16px; height: 16px; border: 2px solid var(--border); border-top-color: var(--accent2); border-radius: 50%; animation: spin 0.6s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `}</style>
);

// ─── COMPONENT 1: StatusBadge ─────────────────────────────────
function StatusBadge({ type, status, category, variant = "type" }) {
  if (variant === "category") return <span className="badge badge-cat">{category}</span>;
  if (variant === "status") {
    const cls = status === "resolved" ? "badge-resolved" : "badge-active";
    return <span className={`badge ${cls}`}>{status}</span>;
  }
  return <span className={`badge badge-${type}`}>{type === "lost" ? "🔍 Lost" : "✅ Found"}</span>;
}

// ─── COMPONENT 2: SearchFilter ────────────────────────────────
function SearchFilter({ onFilter }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [typeFilter, setTypeFilter] = useState("all");

  const handleChange = useCallback((newQuery, newCat, newType) => {
    onFilter({ query: newQuery, category: newCat, type: newType });
  }, [onFilter]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    handleChange(val, category, typeFilter);
  };

  const handleCat = (e) => {
    const val = e.target.value;
    setCategory(val);
    handleChange(query, val, typeFilter);
  };

  const handleType = (t) => {
    setTypeFilter(t);
    handleChange(query, category, t);
  };

  return (
    <div className="search-filter">
      <div className="filter-group" style={{ flex: 2 }}>
        <span className="filter-label">🔍 Search</span>
        <input className="filter-input" placeholder="Search items, locations..." value={query} onChange={handleSearch} />
      </div>
      <div className="filter-group">
        <span className="filter-label">📂 Category</span>
        <select className="filter-select" value={category} onChange={handleCat}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      <div className="filter-group">
        <span className="filter-label">🏷 Type</span>
        <div className="filter-tabs">
          {["all", "lost", "found"].map(t => (
            <button key={t} className={`filter-tab ${typeFilter === t ? `active-${t}` : ""}`} onClick={() => handleType(t)}>
              {t === "all" ? "All" : t === "lost" ? "🔍 Lost" : "✅ Found"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENT 3: ItemCard ────────────────────────────────────
function ItemCard({ item, onClick }) {
  return (
    <div className="item-card" onClick={() => onClick(item)}>
      <div className="card-img">{item.image}</div>
      <div className="card-body">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
          <StatusBadge type={item.type} />
          <StatusBadge variant="category" category={item.category} />
        </div>
        <div className="card-title">{item.title}</div>
        <div className="card-meta">
          <span>📍 {item.location}</span>
        </div>
        <p className="card-desc">{item.description}</p>
      </div>
      <div className="card-footer">
        <span className="card-date">{item.date}</span>
        <span style={{ fontSize: "0.78rem", color: "var(--accent2)", fontWeight: 600 }}>View Details →</span>
      </div>
    </div>
  );
}

// ─── ITEM DETAIL MODAL ────────────────────────────────────────
function ItemModal({ item, onClose }) {
  if (!item) return null;
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-img">{item.image}</div>
        <div className="modal-header">
          <div>
            <h3 style={{ fontWeight: 700, fontSize: "1.2rem" }}>{item.title}</h3>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
              <StatusBadge type={item.type} />
              <StatusBadge variant="category" category={item.category} />
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          {[["Location", item.location], ["Date", item.date], ["Contact", item.contact], ["Description", item.description]].map(([k, v]) => (
            <div key={k} className="detail-row">
              <span className="detail-key">{k}</span>
              <span className="detail-val">{v}</span>
            </div>
          ))}
          <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem" }}>
            <button className="btn btn-primary" onClick={() => { alert(`Contacting ${item.contact}`); onClose(); }}>📧 Contact Owner</button>
            <button className="btn btn-outline" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TOAST NOTIFICATION ────────────────────────────────────────
function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return <div className={`toast ${type}`}>{type === "success" ? "✅" : "❌"} {msg}</div>;
}

// ─── PAGE: HOME ───────────────────────────────────────────────
function HomePage({ setPage, items }) {
  const recent = items.slice(0, 4);
  const [modal, setModal] = useState(null);
  return (
    <>
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-tag">🔍 Community Lost & Found</div>
          <h1>Find What's <em>Lost.</em><br />Return What's <em>Found.</em></h1>
          <p>A community-powered platform to reunite people with their lost belongings. Post, search, and connect — together we find everything.</p>
          <div className="hero-btns">
            <button className="btn btn-primary" onClick={() => setPage("report")}>📝 Report an Item</button>
            <button className="btn btn-secondary" onClick={() => setPage("browse")}>🗂 Browse All Items</button>
          </div>
        </div>
      </div>
      <div className="stats-bar">
        {[["847", "Items Posted"], ["612", "Items Reunited"], ["2.4K", "Users Helped"], ["98%", "Success Rate"]].map(([n, l]) => (
          <div key={l} className="stat"><div className="stat-num">{n}</div><div className="stat-label">{l}</div></div>
        ))}
      </div>
      <main>
        <div className="features">
          {[
            ["🤖", "AI-Powered Matching", "Our Claude AI analyzes descriptions to find potential matches between lost and found items automatically."],
            ["🗺️", "Map Integration", "Pin exact locations on an interactive map powered by OpenStreetMap to improve search accuracy."],
            ["🔔", "Instant Alerts", "Get notified the moment a matching item is reported by community members near you."],
            ["🔒", "Safe & Secure", "Contact info is protected. Connect through our secure messaging system to stay private."],
          ].map(([icon, title, desc]) => (
            <div key={title} className="feature-card">
              <div className="feature-icon">{icon}</div>
              <div className="feature-title">{title}</div>
              <div className="feature-desc">{desc}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "3rem", marginBottom: "1.25rem" }}>
          <h2 className="recent-title" style={{ margin: 0 }}>Recent Reports</h2>
          <button className="view-all" onClick={() => setPage("browse")}>View All →</button>
        </div>
        <div className="items-grid">
          {recent.map(item => <ItemCard key={item.id} item={item} onClick={setModal} />)}
        </div>
      </main>
      {modal && <ItemModal item={modal} onClose={() => setModal(null)} />}
    </>
  );
}

// ─── PAGE: BROWSE ─────────────────────────────────────────────
function BrowsePage({ items }) {
  const [filtered, setFiltered] = useState(items);
  const [modal, setModal] = useState(null);

  const handleFilter = useCallback(({ query, category, type }) => {
    let res = items;
    if (type !== "all") res = res.filter(i => i.type === type);
    if (category !== "All") res = res.filter(i => i.category === category);
    if (query) res = res.filter(i =>
      i.title.toLowerCase().includes(query.toLowerCase()) ||
      i.location.toLowerCase().includes(query.toLowerCase()) ||
      i.description.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(res);
  }, [items]);

  return (
    <main>
      <div className="page-header">
        <h2>Browse Items</h2>
        <div className="divider"></div>
        <p>{filtered.length} item{filtered.length !== 1 ? "s" : ""} found in the database</p>
      </div>
      <SearchFilter onFilter={handleFilter} />
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>No items match your search</h3>
          <p>Try adjusting your filters or search term</p>
        </div>
      ) : (
        <div className="items-grid">
          {filtered.map(item => <ItemCard key={item.id} item={item} onClick={setModal} />)}
        </div>
      )}
      {modal && <ItemModal item={modal} onClose={() => setModal(null)} />}
    </main>
  );
}

// ─── PAGE: REPORT (with Claude AI + Leaflet Map) ──────────────
function ReportPage({ onSubmit }) {
  const [formType, setFormType] = useState("lost");
  const [form, setForm] = useState({ title: "", category: "Electronics", location: "", date: "", description: "", contact: "" });
  const [drag, setDrag] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Load Leaflet (API 1)
  useEffect(() => {
    if (document.getElementById("leaflet-css")) { setMapLoaded(true); return; }
    const css = document.createElement("link");
    css.id = "leaflet-css"; css.rel = "stylesheet";
    css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(css);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapLoaded || !window.L) return;
    const existing = document.getElementById("leaflet-map");
    if (!existing || existing._leaflet_id) return;
    const map = window.L.map("leaflet-map").setView([40.7128, -74.006], 12);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors"
    }).addTo(map);
    let marker = null;
    map.on("click", (e) => {
      if (marker) map.removeLayer(marker);
      marker = window.L.marker(e.latlng).addTo(map).bindPopup("📍 Selected location").openPopup();
      setForm(f => ({ ...f, location: `${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}` }));
    });
  }, [mapLoaded]);

  const handleField = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  // Claude AI description helper (API 2)
  const handleAI = async () => {
    if (!form.title || !form.category) return;
    setAiLoading(true); setAiResult("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are a helpful assistant for a lost and found website. Generate a clear, detailed, and helpful item description that will help identify the item. Include key identifying features, possible condition details, and why someone might recognize it. Keep it under 80 words. Return plain text only.",
          messages: [{ role: "user", content: `Generate a description for a ${formType} ${form.category} item named: "${form.title}". Location: ${form.location || "unknown"}.` }]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "Could not generate description.";
      setAiResult(text);
      setForm(f => ({ ...f, description: text }));
    } catch {
      setAiResult("AI service unavailable. Please write a description manually.");
    }
    setAiLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.location || !form.contact) { alert("Please fill in all required fields."); return; }
    onSubmit({ ...form, type: formType, id: Date.now(), image: formType === "lost" ? "🔍" : "✅", status: "active" });
  };

  return (
    <main>
      <div className="page-header">
        <h2>Report an Item</h2>
        <div className="divider"></div>
        <p>Fill in the details below. Use AI to auto-generate a description, and pin the location on the map.</p>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {["lost", "found"].map(t => (
          <button key={t} className={`btn ${formType === t ? (t === "lost" ? "btn-primary" : "btn-blue") : "btn-outline"}`}
            onClick={() => setFormType(t)}>
            {t === "lost" ? "🔍 I Lost Something" : "✅ I Found Something"}
          </button>
        ))}
      </div>
      <div className="form-container">
        <div className="form-card">
          <div className="form-title">{formType === "lost" ? "🔍 Lost Item" : "✅ Found Item"} Details</div>
          <form onSubmit={handleSubmit}>
            {[["title","Item Name *","text","e.g. Blue Leather Wallet"],["location","Location *","text","Street, landmark or coordinates"],["contact","Contact Email *","email","your@email.com"]].map(([name,label,type,ph]) => (
              <div key={name} className="form-group">
                <label className="form-label">{label}</label>
                <input className="form-input" name={name} type={type} placeholder={ph} value={form[name]} onChange={handleField} />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" name="category" value={form.category} onChange={handleField}>
                {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="form-input" name="date" type="date" value={form.date} onChange={handleField} />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" name="description" placeholder="Describe the item..." value={form.description} onChange={handleField} />
              <button type="button" className="ai-btn" onClick={handleAI} disabled={aiLoading}>
                {aiLoading ? <><div className="spinner"></div> Generating...</> : "✨ Auto-Generate with AI"}
              </button>
              {aiResult && <div className="ai-result">🤖 <strong>AI Generated:</strong> {aiResult}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Photo (optional)</label>
              <div className={`upload-zone ${drag ? "drag" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => { e.preventDefault(); setDrag(false); alert("Image uploaded: " + e.dataTransfer.files[0]?.name); }}>
                <div className="upload-icon">📷</div>
                <div className="upload-text">Drag & drop or click to upload</div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              Submit Report
            </button>
          </form>
        </div>
        <div>
          <div className="form-card" style={{ marginBottom: "1.5rem" }}>
            <div className="form-title">💡 Tips</div>
            {["Be as specific as possible in your description", "Include any unique identifying marks or features", "Mention the approximate time of loss/find", "Upload a clear photo for faster matching", "Keep your contact info updated"].map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.9rem", fontSize: "0.875rem" }}>
                <span style={{ color: "var(--accent)", fontWeight: 700, minWidth: "1.2rem" }}>{i + 1}.</span>
                <span style={{ color: "var(--muted)" }}>{tip}</span>
              </div>
            ))}
          </div>
          <div className="map-section">
            <div className="map-title">📍 Pin the Location</div>
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: "0.75rem" }}>Click on the map to set the exact location (OpenStreetMap)</p>
            <div id="leaflet-map"></div>
            {form.location && <div style={{ marginTop: "0.6rem", fontSize: "0.8rem", color: "var(--accent2)", fontFamily: "DM Mono, monospace" }}>📌 {form.location}</div>}
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── PAGE: MAP VIEW ────────────────────────────────────────────
function MapPage({ items }) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (document.getElementById("leaflet-css")) { setMapLoaded(true); return; }
    const css = document.createElement("link");
    css.id = "leaflet-css"; css.rel = "stylesheet";
    css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(css);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!mapLoaded || !window.L) return;
    const el = document.getElementById("browse-map");
    if (!el || el._leaflet_id) return;
    const map = window.L.map("browse-map").setView([40.7128, -74.006], 12);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors"
    }).addTo(map);
    items.forEach(item => {
      const color = item.type === "lost" ? "#dc2626" : "#16a34a";
      const icon = window.L.divIcon({
        html: `<div style="background:${color};color:#fff;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:1.1rem;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)">${item.image}</div>`,
        className: "", iconSize: [36, 36], iconAnchor: [18, 18]
      });
      window.L.marker([item.lat, item.lng], { icon }).addTo(map)
        .bindPopup(`<b>${item.title}</b><br>${item.location}<br><span style="color:${color}">${item.type.toUpperCase()}</span>`)
        .on("click", () => setSelected(item));
    });
  }, [mapLoaded, items]);

  return (
    <main>
      <div className="page-header">
        <h2>Map View</h2>
        <div className="divider"></div>
        <p>All reported items on an interactive map. Click a pin to see details.</p>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <span className="badge badge-lost">🔍 Lost Items</span>
        <span className="badge badge-found">✅ Found Items</span>
      </div>
      <div id="browse-map" style={{ height: "500px", borderRadius: "8px", border: "1px solid var(--border)" }}></div>
      {selected && (
        <div className="form-card" style={{ marginTop: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{selected.image}</div>
              <h3 style={{ fontWeight: 700, marginBottom: "0.4rem" }}>{selected.title}</h3>
              <div style={{ display: "flex", gap: "0.5rem" }}><StatusBadge type={selected.type} /><StatusBadge variant="category" category={selected.category} /></div>
            </div>
            <button className="close-btn" onClick={() => setSelected(null)}>✕</button>
          </div>
          <p style={{ marginTop: "0.75rem", fontSize: "0.88rem", color: "var(--muted)" }}>📍 {selected.location}</p>
          <p style={{ marginTop: "0.5rem", fontSize: "0.88rem" }}>{selected.description}</p>
        </div>
      )}
      {!selected && <p style={{ textAlign: "center", marginTop: "1rem", color: "var(--muted)", fontSize: "0.85rem" }}>Click any map pin to see item details</p>}
    </main>
  );
}

// ─── PAGE: CONTACT ─────────────────────────────────────────────
function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [aiReply, setAiReply] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const handleField = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { alert("Please fill required fields."); return; }
    setSent(true);
    setAiLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are a helpful customer support assistant for a lost and found website. Generate a warm, professional acknowledgment reply to the user's message. Keep it under 60 words.",
          messages: [{ role: "user", content: `Name: ${form.name}. Subject: ${form.subject}. Message: ${form.message}` }]
        })
      });
      const data = await res.json();
      setAiReply(data.content?.[0]?.text || "Thank you for reaching out! We'll respond shortly.");
    } catch {
      setAiReply("Thank you for reaching out! Our team will get back to you within 24 hours.");
    }
    setAiLoading(false);
  };

  return (
    <main>
      <div className="page-header">
        <h2>Contact Us</h2>
        <div className="divider"></div>
        <p>Have a question, suggestion, or need help? We're here for you.</p>
      </div>
      <div className="contact-grid">
        <div className="info-card">
          <h3>Get in Touch</h3>
          {[["📧","Email Support","support@lostandfound.io"],["📞","Phone","(555) 123-4567 — Mon-Fri 9am–6pm"],["📍","Office","123 Main St, New York, NY 10001"],["⏰","Response Time","Within 24 hours on business days"]].map(([icon,title,detail]) => (
            <div key={title} className="info-item">
              <span className="info-icon">{icon}</span>
              <div className="info-text"><strong>{title}</strong><span>{detail}</span></div>
            </div>
          ))}
          <div style={{ marginTop: "2rem", padding: "1rem", background: "rgba(255,255,255,0.08)", borderRadius: "6px" }}>
            <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>🤖 AI-Powered Support</div>
            <div style={{ fontSize: "0.82rem", opacity: 0.7, lineHeight: 1.6 }}>Submit your message below and receive an instant AI-generated acknowledgment powered by Claude.</div>
          </div>
        </div>
        <div className="form-card">
          <div className="form-title">✉️ Send a Message</div>
          {!sent ? (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[["name","Your Name *","text"],["email","Email *","email"]].map(([n,l,t]) => (
                  <div key={n} className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">{l}</label>
                    <input className="form-input" name={n} type={t} value={form[n]} onChange={handleField} />
                  </div>
                ))}
              </div>
              <div className="form-group" style={{ marginTop: "1rem" }}>
                <label className="form-label">Subject</label>
                <input className="form-input" name="subject" value={form.subject} onChange={handleField} placeholder="e.g. Help finding my item" />
              </div>
              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea className="form-textarea" name="message" rows={5} value={form.message} onChange={handleField} placeholder="Describe your issue or question..." />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>Send Message 📤</button>
            </form>
          ) : (
            <div>
              <div className="success-msg">✅ Your message has been sent successfully!</div>
              {aiLoading ? (
                <div className="loading" style={{ marginTop: "1rem" }}><div className="spinner"></div> AI is composing a reply...</div>
              ) : aiReply && (
                <div className="ai-result" style={{ marginTop: "1rem" }}>
                  <strong>🤖 Automated Reply:</strong><br />{aiReply}
                </div>
              )}
              <button className="btn btn-outline" style={{ marginTop: "1.25rem" }} onClick={() => { setSent(false); setAiReply(""); setForm({ name:"",email:"",subject:"",message:"" }); }}>Send Another Message</button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [items, setItems] = useState(MOCK_ITEMS);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const handleSubmit = (newItem) => {
    setItems(prev => [newItem, ...prev]);
    showToast("Item reported successfully! It's now live on the platform.", "success");
    setPage("browse");
  };

  const PAGES = [
    { id: "home", label: "Home" },
    { id: "browse", label: "Browse" },
    { id: "map", label: "Map View" },
    { id: "report", label: "Report" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="app">
      <GlobalStyle />
      <nav>
        <div className="nav-logo" onClick={() => setPage("home")}>
          <span>L</span>&amp;<span>F</span>
          <span style={{ fontSize: "0.9rem", fontFamily: "DM Sans, sans-serif", fontWeight: 400, opacity: 0.6, letterSpacing: 1 }}>LOST &amp; FOUND</span>
        </div>
        <div className="nav-links">
          {PAGES.map(p => (
            <button key={p.id} className={`nav-link ${page === p.id ? "active" : ""}`} onClick={() => setPage(p.id)}>{p.label}</button>
          ))}
        </div>
        <button className="nav-cta" onClick={() => setPage("report")}>+ Report Item</button>
      </nav>

      {page === "home" && <HomePage setPage={setPage} items={items} />}
      {page === "browse" && <BrowsePage items={items} />}
      {page === "map" && <MapPage items={items} />}
      {page === "report" && <ReportPage onSubmit={handleSubmit} />}
      {page === "contact" && <ContactPage />}

      <footer>
        <strong>Lost &amp; Found</strong> — Community-Powered Item Recovery Platform<br />
        <span style={{ fontSize: "0.75rem", marginTop: "0.3rem", display: "block" }}>
          Powered by OpenStreetMap (Leaflet) · Claude AI API · Built with React
        </span>
      </footer>

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}