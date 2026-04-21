import { useState, useRef, useEffect } from "react";
import { games } from "../lib/games";

function StarRating({ rating }) {
  return (
    <span className="stars">
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
      <span className="rating-num"> {rating}</span>
    </span>
  );
}

function GameCard({ game, onBuy }) {
  const discount = game.originalPrice
    ? Math.round((1 - game.price / game.originalPrice) * 100)
    : null;

  return (
    <div className="game-card">
      <div className={`game-card-header gradient-${game.id}`}>
        <div className="game-emoji-display">{game.image}</div>
        {game.tag && <span className="tag-badge">{game.tag}</span>}
      </div>
      <div className="game-card-body">
        <div className="platform-list">
          {game.platform.map((p) => (
            <span key={p} className="platform-chip">{p}</span>
          ))}
        </div>
        <h3 className="game-title">{game.title}</h3>
        <p className="game-genre">{game.genre}</p>
        <p className="game-desc">{game.description}</p>
        <div className="rating-row">
          <StarRating rating={game.rating} />
          <span className="review-count">({game.reviews.toLocaleString()})</span>
        </div>
        <div className="price-row">
          <span className="price-current">${game.price.toLocaleString()}</span>
          <span className="price-currency">MXN</span>
          {game.originalPrice && (
            <>
              <span className="price-original">${game.originalPrice.toLocaleString()}</span>
              <span className="discount-pill">-{discount}%</span>
            </>
          )}
        </div>
        <button className="buy-btn" onClick={() => onBuy(game)}>
          Comprar ahora →
        </button>
      </div>
    </div>
  );
}

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "¡Hola! Soy GameBot 🎮 ¿En qué puedo ayudarte hoy? Puedo recomendarte juegos, resolver dudas sobre precios o ayudarte con tu compra." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.filter((m) => m.role !== "system"),
        }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply || "Error al responder." }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "⚠️ Error de conexión. Intenta de nuevo." }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Botón flotante */}
      <button className="chat-fab" onClick={() => setOpen(!open)} aria-label="Abrir chat">
        {open ? "✕" : "🎮"}
        {!open && <span className="fab-label">GameBot</span>}
      </button>

      {/* Panel de chat */}
      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-avatar">🤖</div>
            <div>
              <div className="chat-name">GameBot</div>
              <div className="chat-status">● En línea</div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>
                {m.role === "assistant" && <span className="msg-avatar">🤖</span>}
                <div className="msg-bubble">{m.content}</div>
              </div>
            ))}
            {loading && (
              <div className="msg assistant">
                <span className="msg-avatar">🤖</span>
                <div className="msg-bubble typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div className="chat-input-row">
            <input
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Escribe tu pregunta..."
              disabled={loading}
            />
            <button className="chat-send" onClick={send} disabled={loading || !input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function Home() {
  const [filter, setFilter] = useState("Todos");
  const genres = ["Todos", "RPG", "Acción", "Aventura", "Roguelite"];

  const filtered = filter === "Todos"
    ? games
    : games.filter((g) => g.genre.includes(filter));

  const handleBuy = (game) => {
    window.location.href = `/checkout?gameId=${game.id}`;
  };

  return (
    <>

      {/* NAV */}
      <nav>
        <a href="/" className="nav-logo">GAMEVAULT</a>
        <ul className="nav-links">
          <li><a href="#catalog">Catálogo</a></li>
          <li><a href="#about">Nosotros</a></li>
        </ul>
        <a href="#catalog" className="nav-cta">Explorar →</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-badge">⚡ Más de 200 títulos disponibles</div>
        <h1 className="hero-title">
          <span className="title-line1">Tu siguiente</span>
          <span className="title-line2">aventura épica</span>
        </h1>
        <p className="hero-sub">
          Los mejores videojuegos al mejor precio. Compra segura con Stripe, entrega inmediata.
        </p>
        <div className="hero-actions">
          <a href="#catalog" className="btn-primary">Ver catálogo</a>
          <a href="#about" className="btn-secondary">Saber más</a>
        </div>
        <div className="stats-bar">
          {[
            { num: "200+", label: "Títulos" },
            { num: "50K+", label: "Clientes" },
            { num: "4.9★", label: "Rating" },
          ].map((s) => (
            <div key={s.label} className="stat-item">
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATALOG */}
      <section className="catalog-section" id="catalog">
        <div className="section-header">
          <h2 className="section-title">Catálogo</h2>
          <p className="section-sub">Selecciona tu próximo juego favorito</p>
        </div>
        <div className="filter-row">
          {genres.map((g) => (
            <button
              key={g}
              className={`filter-btn ${filter === g ? "active" : ""}`}
              onClick={() => setFilter(g)}
            >
              {g}
            </button>
          ))}
        </div>
        <div className="games-grid">
          {filtered.map((game) => (
            <GameCard key={game.id} game={game} onBuy={handleBuy} />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer id="about">
        <div className="footer-logo">GAMEVAULT</div>
        <p>Tu tienda de videojuegos de confianza · Pagos seguros con Stripe</p>
        <p>© 2024 GameVault · Todos los derechos reservados</p>
        <div>
          <div className="stripe-badge">🔒 Pagos procesados por Stripe · Modo Prueba</div>
        </div>
      </footer>

      {/* CHATBOT */}
      <Chatbot />
    </>
  );
}
