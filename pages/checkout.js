import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/router";
import { games } from "../lib/games";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ game, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setLoading(false);
      return;
    }

    const res = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: game.price, gameTitle: game.title }),
    });

    const { clientSecret, error: apiError } = await res.json();
    if (apiError) {
      setError(apiError);
      setLoading(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/success?game=${game.id}`,
      },
    });

    if (confirmError) {
      setError(confirmError.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="game-summary">
        <div className={`game-icon-lg bg-gradient-${game.gradient}`}>{game.image}</div>
        <div>
          <h3>{game.title}</h3>
          <p className="genre-tag">{game.genre}</p>
          <p className="price-display">${game.price.toLocaleString()} MXN</p>
        </div>
      </div>

      <div className="test-notice">
        🧪 <strong>Modo Prueba</strong> — Usa tarjeta: <code>4242 4242 4242 4242</code>, cualquier fecha futura y CVC
      </div>

      <PaymentElement />

      {error && <div className="error-msg">⚠️ {error}</div>}

      <button type="submit" disabled={!stripe || loading} className="pay-btn">
        {loading ? (
          <span className="btn-loading"><span className="spinner" /> Procesando...</span>
        ) : (
          `Pagar $${game.price.toLocaleString()} MXN`
        )}
      </button>
    </form>
  );
}

export default function Checkout() {
  const router = useRouter();
  const { gameId } = router.query;
  const [game, setGame] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    if (!gameId) return;
    const found = games.find((g) => g.id === gameId);
    if (!found) { router.push("/"); return; }
    setGame(found);

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: found.price, gameTitle: found.title }),
    })
      .then((r) => r.json())
      .then((d) => d.clientSecret && setClientSecret(d.clientSecret));
  }, [gameId]);

  if (!game || !clientSecret) {
    return (
      <div className="loading-screen">
        <div className="spinner-lg" />
        <p>Preparando tu compra...</p>
      </div>
    );
  }

  const appearance = {
    theme: "night",
    variables: {
      colorPrimary: "#a855f7",
      colorBackground: "#1a1a2e",
      colorText: "#ffffff",
      fontFamily: "'Space Mono', monospace",
      borderRadius: "8px",
    },
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #0d0d1a; color: #fff; font-family: 'Space Mono', monospace; }
        .checkout-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: radial-gradient(ellipse at top left, #1a0533 0%, #0d0d1a 60%);
        }
        .checkout-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(168,85,247,0.3);
          border-radius: 20px;
          padding: 2.5rem;
          width: 100%;
          max-width: 480px;
          backdrop-filter: blur(20px);
        }
        .back-btn {
          background: none;
          border: none;
          color: #a855f7;
          cursor: pointer;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: inherit;
          text-decoration: none;
        }
        .back-btn:hover { color: #c084fc; }
        h2 { font-size: 1.5rem; margin-bottom: 1.5rem; color: #c084fc; }
        .game-summary {
          display: flex;
          gap: 1rem;
          align-items: center;
          background: rgba(168,85,247,0.1);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }
        .game-icon-lg { font-size: 2.5rem; }
        .game-summary h3 { font-size: 1rem; color: #fff; }
        .genre-tag { color: #a78bfa; font-size: 0.75rem; margin-top: 0.25rem; }
        .price-display { color: #34d399; font-size: 1.1rem; font-weight: bold; margin-top: 0.25rem; }
        .test-notice {
          background: rgba(234,179,8,0.15);
          border: 1px solid rgba(234,179,8,0.4);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 0.75rem;
          color: #fde68a;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }
        .test-notice code {
          background: rgba(0,0,0,0.3);
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          font-family: inherit;
          letter-spacing: 2px;
        }
        .pay-btn {
          width: 100%;
          margin-top: 1.5rem;
          padding: 1rem;
          background: linear-gradient(135deg, #7c3aed, #a855f7);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-family: inherit;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 1px;
        }
        .pay-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(168,85,247,0.5); }
        .pay-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-loading { display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }
        .spinner-lg {
          width: 48px; height: 48px;
          border: 3px solid rgba(168,85,247,0.3);
          border-top-color: #a855f7;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1rem;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .error-msg {
          background: rgba(239,68,68,0.15);
          border: 1px solid rgba(239,68,68,0.4);
          color: #fca5a5;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.85rem;
          margin-top: 1rem;
        }
        .loading-screen {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #0d0d1a;
          color: #a855f7;
          font-family: 'Space Mono', monospace;
          gap: 1rem;
        }
      `}</style>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      <div className="checkout-page">
        <div className="checkout-card">
          <a href="/" className="back-btn">← Volver a la tienda</a>
          <h2>💳 Completar compra</h2>
          <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
            <CheckoutForm game={game} />
          </Elements>
        </div>
      </div>
    </>
  );
}
