import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import FoxMascot from './ui/FoxMascot';
import GlassCard from './ui/GlassCard';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { user, loginWithGoogle, loginWithEmail, registerWithEmail } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') await loginWithEmail(email, password);
      else await registerWithEmail(email, password);
    } catch (err) {
      setError(translateError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try { await loginWithGoogle(); }
    catch { setError('No se pudo iniciar sesión con Google.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4
                    bg-gradient-to-br from-night-950 via-indigo-950 to-purple-950
                    relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />

      <GlassCard className="w-full max-w-md p-8 md:p-10">
        <div className="flex flex-col items-center text-center mb-8">
          <FoxMascot size={120} />
          <h1 className="mt-4 text-3xl font-light text-white">
            {mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
          </h1>
          <p className="text-sm text-lavender-300/80 mt-1">
            {mode === 'login' ? 'Lilo te estaba esperando' : 'Lilo te guiará desde esta noche'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field icon={<Mail className="w-4 h-4 text-white/50" />}
                 type="email" placeholder="Correo electrónico"
                 value={email} onChange={setEmail} required />
          <Field icon={<Lock className="w-4 h-4 text-white/50" />}
                 type="password" placeholder="Contraseña"
                 value={password} onChange={setPassword} required />

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-sm text-rose-300 text-center">
              {error}
            </motion.p>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full
                       bg-gradient-to-r from-lavender-400 to-violet-500
                       text-white font-medium shadow-glow disabled:opacity-60"
          >
            {loading ? 'Cargando...' : (
              <>
                {mode === 'login' ? <LogIn className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                {mode === 'login' ? 'Entrar' : 'Crear cuenta'}
              </>
            )}
          </motion.button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs uppercase tracking-widest text-white/40">o</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full
                     bg-white/5 border border-white/10 text-white hover:bg-white/10 transition"
        >
          <GoogleIcon /> Continuar con Google
        </button>

        <button
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="w-full mt-6 text-sm text-white/50 hover:text-white/80 transition"
        >
          {mode === 'login' ? '¿No tienes cuenta? Crear una' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </GlassCard>
    </div>
  );
}

function Field({ icon, type, placeholder, value, onChange, required }) {
  return (
    <label className="flex items-center gap-3 rounded-2xl border border-white/10
                      bg-white/5 px-4 py-3 focus-within:border-lavender-400/50 transition">
      {icon}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none"
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function translateError(code) {
  const map = {
    'auth/invalid-credential':   'Credenciales incorrectas.',
    'auth/user-not-found':       'No existe una cuenta con ese email.',
    'auth/wrong-password':       'Contraseña incorrecta.',
    'auth/email-already-in-use': 'Ya existe una cuenta con ese email.',
    'auth/weak-password':        'La contraseña debe tener al menos 6 caracteres.',
    'auth/invalid-email':        'Email inválido.',
  };
  return map[code] ?? 'Algo salió mal. Inténtalo de nuevo.';
}
