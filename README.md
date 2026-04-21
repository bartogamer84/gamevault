# 🎮 GameVault — Tienda de Videojuegos

Tienda de videojuegos responsiva con pagos Stripe (modo prueba) y chatbot vía OpenRouter.

---

## 🚀 Stack
- **Next.js 14** (Pages Router)
- **Stripe** — pagos con tarjeta en modo prueba
- **OpenRouter** — chatbot con LLaMA 3.1 (gratis)
- **Vercel** — hosting

---

## 🔑 Variables de entorno necesarias

Crea un archivo `.env.local` en la raíz del proyecto:

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
OPENROUTER_API_KEY=sk-or-...
NEXT_PUBLIC_SITE_URL=https://tu-proyecto.vercel.app
```

---

## 📦 Cómo obtener las API keys

### Stripe (Modo Prueba)
1. Ve a https://dashboard.stripe.com/register y crea una cuenta
2. En el dashboard, activa **"Modo de prueba"** (toggle arriba a la derecha)
3. Ve a **Developers → API Keys**
4. Copia `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
5. Copia `Secret key` → `STRIPE_SECRET_KEY`

**Tarjeta de prueba:** `4242 4242 4242 4242`, fecha cualquiera futura, CVC cualquiera

### OpenRouter (Gratis)
1. Ve a https://openrouter.ai y crea una cuenta
2. Ve a **Keys → Create Key**
3. Copia la clave → `OPENROUTER_API_KEY`
4. El modelo `meta-llama/llama-3.1-8b-instruct:free` es **gratuito** ✅

---

## 💻 Correr localmente

```bash
# 1. Instalar dependencias
npm install

# 2. Crear .env.local con tus claves
cp .env.local.example .env.local
# (edita el archivo con tus claves reales)

# 3. Iniciar el servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:3000
```

---

## 🌐 Desplegar en Vercel

### Opción A — CLI de Vercel (recomendado)
```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Desde la carpeta del proyecto
vercel

# 3. Seguir las instrucciones:
#    - Set up and deploy: Y
#    - Which scope: tu cuenta
#    - Link to existing project: N
#    - Project name: gamevault (o el que quieras)
#    - Directory: ./
#    - Override settings: N

# 4. Para producción:
vercel --prod
```

### Opción B — GitHub + Vercel Dashboard
1. Sube el proyecto a GitHub:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/tu-usuario/gamevault.git
   git push -u origin main
   ```
2. Ve a https://vercel.com/new
3. Importa tu repositorio de GitHub
4. **Configura las variables de entorno** en el dashboard:
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `OPENROUTER_API_KEY`
   - `NEXT_PUBLIC_SITE_URL` → tu URL de Vercel (ej: `https://gamevault.vercel.app`)
5. Click **Deploy**

---

## 📁 Estructura del proyecto

```
gamevault/
├── lib/
│   └── games.js              # Datos de los videojuegos
├── pages/
│   ├── api/
│   │   ├── create-payment-intent.js  # API: Stripe
│   │   └── chat.js                   # API: OpenRouter chatbot
│   ├── _app.js
│   ├── index.js              # Página principal (catálogo)
│   ├── checkout.js           # Página de pago con Stripe
│   └── success.js            # Página de éxito post-pago
├── .env.local.example
├── next.config.js
├── package.json
└── vercel.json
```

---

## 🧪 Flujo de prueba

1. Abre `http://localhost:3000`
2. Selecciona un juego y haz clic en **"Comprar ahora"**
3. En el checkout usa la tarjeta de prueba:
   - Número: `4242 4242 4242 4242`
   - Fecha: cualquiera futura (ej: `12/28`)
   - CVC: cualquier 3 dígitos (ej: `123`)
4. El chatbot está en el botón flotante inferior derecho 🎮
