'use client';

import { useState, useEffect, createContext, useContext } from "react";

// ─── DATA STORE (in-memory, simulates a backend) ───────────────────────────
const DB = {
  users: [
    { id: "u1", name: "Arjun Sharma", email: "user@demo.com", password: "demo123", role: "user", city: "Bengaluru" },
  ],
  bookings: [],
  nextId: 100,
};

const SERVICES = ["Satyanarayan Puja", "Griha Pravesh", "Vivah Puja", "Navagraha Puja", "Ganesh Puja", "Rudrabhishek", "Namkaran Puja", "Mundan Ceremony"];
const CITIES = ["Bengaluru", "Mumbai", "Delhi", "Chennai", "Hyderabad", "Pune", "Kolkata"];

// ─── AUTH CONTEXT ───────────────────────────────────────────────────────────
const AuthCtx = createContext(null);
function useAuth() { return useContext(AuthCtx); }

// ─── THEME CONTEXT ───────────────────────────────────────────────────────────
const ThemeCtx = createContext(null);
function useTheme() { return useContext(ThemeCtx); }

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('pandit-theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('pandit-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeCtx.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeCtx.Provider>
  );
}

// ─── HELPERS ────────────────────────────────────────────────────────────────
function uid() { return `id_${++DB.nextId}`; }
function today() { return new Date().toISOString().split("T")[0]; }

const STATUS_COLORS = {
  pending: "#f59e0b",
  accepted: "#10b981",
  rejected: "#ef4444",
  completed: "#6366f1",
};
const STATUS_LABELS = {
  pending: "⏳ Pending",
  accepted: "✅ Accepted",
  rejected: "❌ Rejected",
  completed: "🎉 Completed",
};

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function Badge({ status }) {
  return (
    <span style={{
      background: STATUS_COLORS[status] + "22",
      color: STATUS_COLORS[status],
      border: `1px solid ${STATUS_COLORS[status]}44`,
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: "0.03em",
    }}>{STATUS_LABELS[status]}</span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border-primary)",
      borderRadius: 16,
      padding: "24px",
      boxShadow: "0 4px 6px var(--shadow-secondary)",
      ...style,
    }}>{children}</div>
  );
}

function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontSize: 12, color: "var(--text-accent)", fontWeight: 700, marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</label>}
      <input style={{
        width: "100%", boxSizing: "border-box",
        background: "var(--input-bg)",
        border: "1px solid var(--input-border)",
        borderRadius: 10, padding: "10px 14px",
        color: "var(--text-primary)", fontSize: 15, outline: "none",
        transition: "border-color 0.2s",
      }}
        onFocus={e => e.target.style.borderColor = "var(--input-focus)"}
        onBlur={e => e.target.style.borderColor = "var(--input-border)"}
        {...props}
      />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontSize: 12, color: "var(--text-accent)", fontWeight: 700, marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</label>}
      <select style={{
        width: "100%", boxSizing: "border-box",
        background: "var(--bg-tertiary)",
        border: "1px solid var(--input-border)",
        borderRadius: 10, padding: "10px 14px",
        color: "var(--text-primary)", fontSize: 15, outline: "none",
      }} {...props}>{children}</select>
    </div>
  );
}

function Btn({ children, variant = "primary", style = {}, ...props }) {
  const base = {
    border: "none", borderRadius: 10, padding: "11px 22px",
    fontWeight: 700, fontSize: 14, cursor: "pointer",
    letterSpacing: "0.04em", transition: "all 0.15s",
    ...style,
  };
  const variants = {
    primary: { background: "var(--gradient-primary)", color: "#fff" },
    danger: { background: "rgba(239,68,68,0.15)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)" },
    success: { background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)" },
    ghost: { background: "var(--bg-overlay)", color: "var(--text-accent)", border: "1px solid var(--border-accent)" },
  };
  return <button style={{ ...base, ...variants[variant] }} {...props}>{children}</button>;
}

// ─── AUTH SCREENS ────────────────────────────────────────────────────────────

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user", city: "Bengaluru" });
  const [err, setErr] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function handleLogin() {
    const user = DB.users.find(u => u.email === form.email && u.password === form.password);
    if (!user) return setErr("Invalid email or password.");
    setErr("");
    onAuth(user);
  }

  function handleSignup() {
    if (!form.name || !form.email || !form.password) return setErr("All fields required.");
    if (DB.users.find(u => u.email === form.email)) return setErr("Email already registered.");
    const user = { id: uid(), name: form.name, email: form.email, password: form.password, role: form.role, city: form.city };
    if (form.role === "pandit") {
      Object.assign(user, { service: "", price: "", bio: "", available: false, profileComplete: false });
    }
    DB.users.push(user);
    setErr("");
    onAuth(user);
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg-primary)",
    }}>
      {/* Decorative */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: "radial-gradient(circle at 80% 80%, var(--bg-overlay) 0%, transparent 60%)",
        pointerEvents: "none"
      }} />

      <div style={{ width: "100%", maxWidth: 440, padding: "0 20px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🕉️</div>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 32, color: "var(--text-accent)", fontWeight: 700, letterSpacing: "-0.01em" }}>PanditJi</div>
          <div style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>Sacred services, simplified</div>
        </div>

        <Card>
          {/* Tab switcher */}
          <div style={{ display: "flex", background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: 4, marginBottom: 24 }}>
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setErr(""); }}
                style={{
                  flex: 1, padding: "8px 0", border: "none", borderRadius: 8,
                  background: mode === m ? "rgba(232,160,69,0.2)" : "transparent",
                  color: mode === m ? "#e8a045" : "#5a4830",
                  fontWeight: 700, fontSize: 13, cursor: "pointer",
                  transition: "all 0.15s", letterSpacing: "0.06em", textTransform: "uppercase",
                }}>
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {err && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13 }}>{err}</div>}

          {mode === "signup" && <Input label="Full Name" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your name" />}
          <Input label="Email" type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" />
          <Input label="Password" type="password" value={form.password} onChange={e => set("password", e.target.value)} placeholder="••••••••" />

          {mode === "signup" && (
            <>
              <Select label="I am a" value={form.role} onChange={e => set("role", e.target.value)}>
                <option value="user">👤 User (looking for Pandit)</option>
                <option value="pandit">🛕 Pandit (offering services)</option>
              </Select>
              <Select label="City" value={form.city} onChange={e => set("city", e.target.value)}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </Select>
            </>
          )}

          <Btn style={{ width: "100%", padding: "13px", marginTop: 4, fontSize: 15 }}
            onClick={mode === "login" ? handleLogin : handleSignup}>
            {mode === "login" ? "Sign In →" : "Create Account →"}
          </Btn>

          {mode === "login" && (
            <div style={{ marginTop: 16, background: "rgba(255,200,80,0.05)", borderRadius: 8, padding: "12px 14px", fontSize: 12, color: "#7a6040", lineHeight: 1.7 }}>
              <strong style={{ color: "#a07840" }}>Demo account:</strong><br />
              👤 User: user@demo.com / demo123
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────

function Nav({ user, tab, setTab, onLogout }) {
  const { theme, toggleTheme } = useTheme();
  const userTabs = [
    { id: "search", label: "🔍 Find Pandits" },
    { id: "bookings", label: "📋 My Bookings" },
  ];
  const panditTabs = [
    { id: "profile", label: "👤 My Profile" },
    { id: "requests", label: "📥 Requests" },
  ];
  const tabs = user.role === "user" ? userTabs : panditTabs;

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "var(--bg-secondary)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border-primary)",
      display: "flex", alignItems: "center", padding: "0 24px", height: 60,
    }}>
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "var(--text-accent)", fontWeight: 700, fontSize: 20, marginRight: 32 }}>🕉️ PanditJi</div>
      <div style={{ display: "flex", gap: 4, flex: 1 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              padding: "8px 16px", border: "none", borderRadius: 8,
              background: tab === t.id ? "var(--bg-overlay)" : "transparent",
              color: tab === t.id ? "var(--text-accent)" : "var(--text-secondary)",
              fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.15s",
            }}>{t.label}</button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={toggleTheme}
          style={{
            background: "var(--bg-overlay)",
            border: "1px solid var(--border-accent)",
            borderRadius: 8,
            padding: "6px",
            cursor: "pointer",
            color: "var(--text-accent)",
            fontSize: 16,
            transition: "all 0.2s",
          }}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <span style={{ color: "var(--text-secondary)", fontSize: 13 }}>
          {user.role === "pandit" ? "🛕" : "👤"} {user.name}
        </span>
        <Btn variant="ghost" style={{ padding: "7px 14px", fontSize: 12 }} onClick={onLogout}>Logout</Btn>
      </div>
    </nav>
  );
}

// ─── USER: SEARCH PANDITS ─────────────────────────────────────────────────────

function SearchPandits({ user }) {
  const [city, setCity] = useState(user.city || "Bengaluru");
  const [service, setService] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [bookingPandit, setBookingPandit] = useState(null);
  const [toast, setToast] = useState("");

  function search() {
    let pandits = DB.users.filter(u => u.role === "pandit" && u.profileComplete);
    pandits = pandits.filter(p => p.city.toLowerCase() === city.toLowerCase());
    if (service) pandits = pandits.filter(p => p.service === service);
    setResults(pandits);
    setSearched(true);
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  return (
    <div>
      {toast && (
        <div style={{
          position: "fixed", top: 72, right: 24, zIndex: 999,
          background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)",
          color: "#10b981", padding: "12px 20px", borderRadius: 12, fontWeight: 600,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}>{toast}</div>
      )}

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", color: "var(--text-accent)", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Find a Pandit</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: 28 }}>Search for experienced pandits in your city</p>

        <Card style={{ marginBottom: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 16, alignItems: "end" }}>
            <div>
              <label style={{ display: "block", fontSize: 11, color: "var(--text-accent)", fontWeight: 700, marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>City *</label>
              <select value={city} onChange={e => setCity(e.target.value)}
                style={{ width: "100%", background: "var(--bg-tertiary)", border: "1px solid var(--input-border)", borderRadius: 10, padding: "10px 14px", color: "var(--text-primary)", fontSize: 14, outline: "none" }}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, color: "var(--text-accent)", fontWeight: 700, marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>Service</label>
              <select value={service} onChange={e => setService(e.target.value)}
                style={{ width: "100%", background: "var(--bg-tertiary)", border: "1px solid var(--input-border)", borderRadius: 10, padding: "10px 14px", color: "var(--text-primary)", fontSize: 14, outline: "none" }}>
                <option value="">All Services</option>
                {SERVICES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <Btn onClick={search} style={{ height: 42, whiteSpace: "nowrap" }}>Search →</Btn>
          </div>
        </Card>

        {searched && (
          <>
            <div style={{ color: "var(--text-secondary)", fontSize: 13, marginBottom: 16 }}>{results.length} pandit{results.length !== 1 ? "s" : ""} found in {city}</div>
            {results.length === 0 ? (
              <Card style={{ textAlign: "center", padding: "48px 24px" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                <div style={{ color: "var(--text-secondary)", fontSize: 15 }}>No pandits found. Try a different city or service.</div>
              </Card>
            ) : (
              <div style={{ display: "grid", gap: 16 }}>
                {results.map(p => (
                  <Card key={p.id} style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 24px" }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: "50%",
                      background: "linear-gradient(135deg,#e8a045,#c4721a)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22, flexShrink: 0,
                    }}>🛕</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Playfair Display',Georgia,serif", color: "var(--text-accent)", fontSize: 18, fontWeight: 700 }}>{p.name}</div>
                      <div style={{ color: "var(--text-secondary)", fontSize: 13, marginTop: 3 }}>
                        📍 {p.city} &nbsp;·&nbsp; 🙏 {p.service}
                      </div>
                      {p.bio && <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 4 }}>{p.bio}</div>}
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ color: "var(--text-accent)", fontSize: 22, fontWeight: 800, fontFamily: "'Playfair Display',Georgia,serif" }}>₹{p.price.toLocaleString()}</div>
                      <div style={{ color: "var(--text-muted)", fontSize: 11, marginBottom: 8 }}>per ceremony</div>
                      <Btn onClick={() => setBookingPandit(p)}>Book Now</Btn>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {bookingPandit && (
        <BookingModal
          pandit={bookingPandit}
          user={user}
          onClose={() => setBookingPandit(null)}
          onBooked={() => {
            setBookingPandit(null);
            showToast("✅ Booking request sent! Waiting for pandit approval.");
          }}
        />
      )}
    </div>
  );
}

// ─── BOOKING MODAL ────────────────────────────────────────────────────────────

function BookingModal({ pandit, user, onClose, onBooked }) {
  const [service, setService] = useState(pandit.service);
  const [date, setDate] = useState("");
  const [err, setErr] = useState("");

  function book() {
    if (!date) return setErr("Please select a date.");
    if (date < today()) return setErr("Date must be in the future.");
    const booking = {
      id: uid(),
      userId: user.id,
      panditId: pandit.id,
      service,
      date,
      status: "pending",
      userName: user.name,
      panditName: pandit.name,
    };
    DB.bookings.push(booking);
    onBooked();
  }

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#0e0905", border: "1px solid rgba(255,200,100,0.15)",
        borderRadius: 20, padding: 32, width: "100%", maxWidth: 440,
        boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <div style={{ fontSize: 32 }}>🛕</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display',Georgia,serif", color: "#e8c87a", fontSize: 20, fontWeight: 700 }}>Book {pandit.name}</div>
            <div style={{ color: "#7a5030", fontSize: 13 }}>₹{pandit.price.toLocaleString()} · {pandit.city}</div>
          </div>
        </div>

        {err && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13 }}>{err}</div>}

        <Select label="Select Service" value={service} onChange={e => setService(e.target.value)}>
          {SERVICES.map(s => <option key={s}>{s}</option>)}
        </Select>

        <Input label="Select Date" type="date" value={date} onChange={e => setDate(e.target.value)} min={today()} />

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <Btn variant="ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</Btn>
          <Btn style={{ flex: 2 }} onClick={book}>Request Booking 🙏</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── USER: MY BOOKINGS ────────────────────────────────────────────────────────

function MyBookings({ user }) {
  const [, forceUpdate] = useState(0);
  const bookings = DB.bookings.filter(b => b.userId === user.id);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
      <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", color: "#e8c87a", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>My Bookings</h2>
      <p style={{ color: "#7a5030", marginBottom: 28 }}>Track all your booking requests</p>

      {bookings.length === 0 ? (
        <Card style={{ textAlign: "center", padding: "48px 24px" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <div style={{ color: "#5a4030", fontSize: 15 }}>No bookings yet. Search for a pandit to get started!</div>
        </Card>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {bookings.map(b => (
            <Card key={b.id} style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 24px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ fontFamily: "'Playfair Display',Georgia,serif", color: "#e8c87a", fontSize: 17, fontWeight: 700 }}>{b.panditName}</span>
                  <Badge status={b.status} />
                </div>
                <div style={{ color: "#7a5030", fontSize: 13 }}>🙏 {b.service} &nbsp;·&nbsp; 📅 {b.date}</div>
              </div>
              {b.status === "accepted" && (
                <Btn variant="success" onClick={() => {
                  const idx = DB.bookings.findIndex(x => x.id === b.id);
                  DB.bookings[idx].status = "completed";
                  forceUpdate(n => n + 1);
                }} style={{ fontSize: 12, padding: "8px 14px" }}>Mark Complete</Btn>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Legend */}
      <div style={{ marginTop: 28, display: "flex", gap: 16, flexWrap: "wrap" }}>
        {Object.keys(STATUS_LABELS).map(s => (
          <span key={s} style={{ display: "flex", alignItems: "center", gap: 6, color: "#5a4030", fontSize: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_COLORS[s], display: "inline-block" }} />
            {STATUS_LABELS[s]}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── PANDIT: PROFILE ──────────────────────────────────────────────────────────

function PanditProfile({ user, setUser }) {
  const pandit = DB.users.find(u => u.id === user.id);
  const [form, setForm] = useState({ name: pandit.name || "", city: pandit.city || CITIES[0], service: pandit.service || SERVICES[0], price: pandit.price || "", bio: pandit.bio || "" });
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");

  function save() {
    if (!form.name.trim()) return setErr("Name is required.");
    if (!form.price || Number(form.price) <= 0) return setErr("Please enter a valid price.");
    setErr("");
    const idx = DB.users.findIndex(u => u.id === user.id);
    const updated = { ...form, price: Number(form.price), available: true, profileComplete: true };
    Object.assign(DB.users[idx], updated);
    setUser({ ...user, ...updated });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 24px" }}>
      <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", color: "#e8c87a", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>My Profile</h2>
      <p style={{ color: "#7a5030", marginBottom: 28 }}>Update your details to appear in search results</p>

      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg,#e8a045,#c4721a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>🛕</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display',Georgia,serif", color: "#e8c87a", fontSize: 20, fontWeight: 700 }}>{pandit.name}</div>
            <div style={{ color: "#7a5030", fontSize: 13 }}>{pandit.email}</div>
          </div>
        </div>

        {err && <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 13 }}>{err}</div>}

        <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        <Select label="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}>
          {CITIES.map(c => <option key={c}>{c}</option>)}
        </Select>
        <Select label="Primary Service" value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}>
          {SERVICES.map(s => <option key={s}>{s}</option>)}
        </Select>
        <Input label="Price per Ceremony (₹)" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} />
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 11, color: "#a0855b", fontWeight: 700, marginBottom: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>Bio</label>
          <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={3} placeholder="Brief description about your experience..."
            style={{ width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,200,120,0.2)", borderRadius: 10, padding: "10px 14px", color: "#f5ede0", fontSize: 14, outline: "none", resize: "vertical" }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Btn onClick={save} style={{ flex: 1, padding: 13, fontSize: 15 }}>
            {user.profileComplete ? "Save Changes ✓" : "Complete Profile & Go Live 🚀"}
          </Btn>
          {saved && <span style={{ color: "#10b981", fontSize: 13, fontWeight: 600 }}>✅ {user.profileComplete ? "Saved!" : "Profile live!"}</span>}
        </div>
      </Card>
    </div>
  );
}

// ─── PANDIT: BOOKING REQUESTS ─────────────────────────────────────────────────

function BookingRequests({ user }) {
  const [, forceUpdate] = useState(0);
  const bookings = DB.bookings.filter(b => b.panditId === user.id);
  const pending = bookings.filter(b => b.status === "pending");
  const handled = bookings.filter(b => b.status !== "pending");

  function handle(id, status) {
    const idx = DB.bookings.findIndex(b => b.id === id);
    DB.bookings[idx].status = status;
    forceUpdate(n => n + 1);
  }

  function BookingRow({ b, actions }) {
    return (
      <Card style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 24px" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,200,80,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>👤</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ color: "#e8c87a", fontWeight: 700, fontSize: 16 }}>{b.userName}</span>
            <Badge status={b.status} />
          </div>
          <div style={{ color: "#7a5030", fontSize: 13 }}>🙏 {b.service} &nbsp;·&nbsp; 📅 {b.date}</div>
        </div>
        {actions && (
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <Btn variant="success" onClick={() => handle(b.id, "accepted")} style={{ fontSize: 12, padding: "8px 14px" }}>✅ Accept</Btn>
            <Btn variant="danger" onClick={() => handle(b.id, "rejected")} style={{ fontSize: 12, padding: "8px 14px" }}>❌ Reject</Btn>
          </div>
        )}
      </Card>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
      <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", color: "#e8c87a", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Booking Requests</h2>
      <p style={{ color: "#7a5030", marginBottom: 28 }}>Review and respond to booking requests from users</p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
        {[
          { label: "Pending", count: pending.length, color: "#f59e0b", icon: "⏳" },
          { label: "Accepted", count: bookings.filter(b => b.status === "accepted").length, color: "#10b981", icon: "✅" },
          { label: "Total", count: bookings.length, color: "#e8c87a", icon: "📊" },
        ].map(s => (
          <Card key={s.label} style={{ textAlign: "center", padding: "18px 12px" }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ color: s.color, fontSize: 28, fontWeight: 800, fontFamily: "'Playfair Display',Georgia,serif" }}>{s.count}</div>
            <div style={{ color: "#5a4030", fontSize: 12, marginTop: 2 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {pending.length > 0 && (
        <>
          <div style={{ color: "#f59e0b", fontSize: 13, fontWeight: 700, marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>⏳ Pending Requests ({pending.length})</div>
          <div style={{ display: "grid", gap: 12, marginBottom: 28 }}>
            {pending.map(b => <BookingRow key={b.id} b={b} actions={true} />)}
          </div>
        </>
      )}

      {handled.length > 0 && (
        <>
          <div style={{ color: "#5a4030", fontSize: 13, fontWeight: 700, marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>History</div>
          <div style={{ display: "grid", gap: 12 }}>
            {handled.map(b => <BookingRow key={b.id} b={b} actions={false} />)}
          </div>
        </>
      )}

      {bookings.length === 0 && (
        <Card style={{ textAlign: "center", padding: "48px 24px" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📥</div>
          <div style={{ color: "#5a4030", fontSize: 15 }}>No booking requests yet. Complete your profile to appear in search results.</div>
        </Card>
      )}
    </div>
  );
}

// ─── DASHBOARD WRAPPER ────────────────────────────────────────────────────────

function Dashboard({ user, onLogout }) {
  const [currentUser, setCurrentUser] = useState(user);
  // New pandits land on profile tab to fill details first
  const [tab, setTab] = useState(user.role === "pandit" ? "profile" : "search");

  const isNewPandit = currentUser.role === "pandit" && !currentUser.profileComplete;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)" }}>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: "radial-gradient(circle at 90% 90%, var(--bg-overlay) 0%, transparent 60%)",
        pointerEvents: "none"
      }} />
      <Nav user={currentUser} tab={tab} setTab={setTab} onLogout={onLogout} />
      {isNewPandit && tab === "profile" && (
        <div style={{
          background: "var(--bg-overlay)",
          borderBottom: "1px solid var(--border-accent)",
          padding: "12px 24px",
          display: "flex", alignItems: "center", gap: 10,
          position: "relative",
        }}>
          <span style={{ fontSize: 18 }}>🛕</span>
          <span style={{ color: "var(--text-accent)", fontSize: 14, fontWeight: 600 }}>Welcome! Please complete your profile below to appear in search results for users.</span>
        </div>
      )}
      <div style={{ position: "relative" }}>
        {currentUser.role === "user" && tab === "search" && <SearchPandits user={currentUser} />}
        {currentUser.role === "user" && tab === "bookings" && <MyBookings user={currentUser} />}
        {currentUser.role === "pandit" && tab === "profile" && <PanditProfile user={currentUser} setUser={setCurrentUser} />}
        {currentUser.role === "pandit" && tab === "requests" && <BookingRequests user={currentUser} />}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <ThemeProvider>
      <AuthCtx.Provider value={{ user, setUser }}>
        {user ? (
          <Dashboard user={user} onLogout={() => setUser(null)} />
        ) : (
          <AuthScreen onAuth={setUser} />
        )}
      </AuthCtx.Provider>
    </ThemeProvider>
  );
}
