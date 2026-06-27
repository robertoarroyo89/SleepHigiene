# 🦊 Lilo — Higiene del Sueño

PWA en español para mejorar tus hábitos de sueño con un zorrito como guía.

**Stack:** React + Vite + Tailwind CSS + Framer Motion + Firebase + Vercel

---

## 📦 Qué incluye

- **50 hábitos** de higiene del sueño en 5 categorías (mañana, día, tarde-noche, rutina, dormitorio)
- **12 suplementos** explicados (magnesio, L-teanina, apigenina, etc.) con dosis y timing
- **Registro diario de sueño** (horas, calidad, despertares, sensación, notas)
- **Estadísticas** con gráficas a 7/14/30 días e insights generados por Lilo
- **Recordatorios locales** (rutina nocturna, hora de dormir, registro matutino)
- **Login con Google + Email/Password** (Firebase Auth)
- **PWA instalable** en móvil y escritorio

---

## 🚀 Pasos para lanzarlo

### 1. Crear proyecto en Firebase

1. Ve a [console.firebase.google.com](https://console.firebase.google.com) y crea un proyecto nuevo (ej. "lilo-sleep")
2. En **Authentication → Sign-in method**, activa **Email/Password** y **Google**
3. En **Firestore Database**, crea una base de datos en modo producción (región europe-west1 o la más cercana)
4. Pega estas **reglas de seguridad** en Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /daily_logs/{date} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

5. En **Configuración del proyecto → Tus apps → Añadir app web**, copia los valores de `firebaseConfig`. Los necesitarás en el siguiente paso.

### 2. Subir a GitHub

1. Crea un repo nuevo en GitHub (privado o público, da igual)
2. Sube todos los archivos de esta carpeta (puedes arrastrarlos por la web de GitHub o usar Codespaces)
3. **No subas `.env.local`** — ya está en `.gitignore`

### 3. Generar los iconos PWA

Necesitas estos 4 archivos en `/public/`:
- `icon-192.png` (192×192 px)
- `icon-512.png` (512×512 px)
- `icon-512-maskable.png` (512×512 px, con margen interior)
- `badge-72.png` (72×72 px)

**Forma rápida:** usa [maskable.app/editor](https://maskable.app/editor) o [realfavicongenerator.net](https://realfavicongenerator.net) con un PNG cuadrado de un zorrito (puedes generarlo en Midjourney, DALL-E o usar un emoji 🦊 sobre fondo morado).

### 4. Desplegar en Vercel

1. Ve a [vercel.com](https://vercel.com) → New Project
2. Importa tu repo de GitHub
3. En **Environment Variables**, añade las 6 variables del archivo `.env.example` con los valores de Firebase:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
4. Deploy

### 5. Añadir tu dominio Vercel a Firebase Auth

Para que el login con Google funcione en producción:

1. Firebase Console → Authentication → Settings → Authorized domains
2. Añade el dominio que te dé Vercel (ej. `lilo-sleep.vercel.app`)

---

## 🛠 Desarrollo local (opcional)

```bash
npm install
cp .env.example .env.local
# Rellena .env.local con tus claves de Firebase
npm run dev
```

Abre http://localhost:5173

---

## 📱 Notas sobre notificaciones

- **Android + Chrome**: funcionan completas, incluso con la app cerrada un rato
- **Escritorio**: funcionan perfectas
- **iOS / iPhone**: solo desde iOS 16.4+ y **debes instalar la PWA** (Compartir → Añadir a pantalla de inicio en Safari)
- Son notificaciones **locales** (sin backend). Si cierras la app del todo durante horas, los temporizadores se reinician al volver a abrirla.

---

## 🗂 Estructura

```
src/
├── components/      Componentes principales (Dashboard, HabitTracker, etc.)
│   └── ui/          Reutilizables (GlassCard, FoxMascot, ProgressRing)
├── context/         AuthContext
├── hooks/           useAuth, useUserProfile, useDailyLog, useWeeklyStats
├── services/        firebase, userService, logService, notificationService
├── data/            habits.js (50 hábitos), supplements.js (12 suplementos)
├── utils/           dates.js
├── App.jsx          Routing
└── main.jsx         Entry point
```

---

¡A dormir mejor! 🌙
