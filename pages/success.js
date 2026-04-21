import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { games } from "../lib/games";

export default function Success() {
  const router = useRouter();
  const { game: gameId } = router.query;
  const [game, setGame] = useState(null);

  useEffect(() => {
    if (gameId) {
      const found = games.find((g) => g.id === gameId);
      setGame(found || null);
    }
  }, [gameId]);

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0d0d1a; color: #fff; font-family: 'Space Mono', monospace; }
        .success-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: radial-gradient(ellipse at center, #052e16 0%, #0d0d1a 60%);
        }
        .success-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(52,211,153,0.4);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          width: 100%;
          max-width: 480px;
          text-align: center;
          backdrop-filter: blur(20px);
          animation: fadeUp 0.6s ease;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .check-circle {
          width: 80px; height: 80px;
          background: linear-gradient(135deg, #059669, #34d399);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          margin: 0 auto 1.5rem;
          box-shadow: 0 0 40px rgba(52,211,153,0.4);
        }
        h1 { font-size: 1.8rem; color: #34d399; margin-bottom: 0.75rem; }
        .subtitle { color: #a1a1aa; font-size: 0.9rem; line-height: 1.6; margin-bottom: 2rem; }
        .game-purchased {
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.2);
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: left;
        }
        .game-emoji { font-size: 2.5rem; }
        .game-name { font-size: 1rem; color: #fff; font-weight: bold; }
        .game-genre { font-size: 0.75rem; color: #6ee7b7; margin-top: 0.25rem; }
        .order-id { font-size: 0.7rem; color: #52525b; margin-bottom: 2rem; }
        .btn-home {
          display: inline-block;
          padding: 0.9rem 2rem;
          background: linear-gradient(135deg, #059669, #34d399);
          color: #fff;
          text-decoration: none;
          border-radius: 10px;
          font-weight: bold;
          font-family: inherit;
          transition: all 0.2s;
          letter-spacing: 1px;
        }
        .btn-home:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(52,211,153,0.4); }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      <div className="success-page">
        <div className="success-card">
          <div className="check-circle">✓</div>
          <h1>¡Compra exitosa!</h1>
          <p className="subtitle">
            Tu pago fue procesado correctamente. Recibirás un correo de confirmación con los detalles.
          </p>

          {game && (
            <div className="game-purchased">
              <div className="game-emoji">{game.image}</div>
              <div>
                <div className="game-name">{game.title}</div>
                <div className="game-genre">{game.genre}</div>
              </div>
            </div>
          )}

          <p className="order-id">
            Order #{Math.random().toString(36).substring(2, 10).toUpperCase()} · {new Date().toLocaleDateString("es-MX")}
          </p>

          <a href="/" className="btn-home">← Volver a la tienda</a>
        </div>
      </div>
    </>
  );
}
