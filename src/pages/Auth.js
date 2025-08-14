import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import '../login.css';

export default function Auth() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg('');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return setMsg(error.message);

    // create profile row
    const uid = data.user?.id;
    if (uid) {
      await supabase.from('profiles').upsert({ id: uid, display_name: displayName || email });
    }
    setMsg('Check your email to confirm your account.');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMsg('');
  };

  if (user) {
    return (
      <div className="Home">
        <header className="login-container">
          <h1>Welcome{user.email ? `, ${user.email}` : ''}</h1>
          <p>You are logged in.</p>
          <button className="bmi-button-secondary" onClick={handleLogout}>Sign out</button>
        </header>
      </div>
    );
  }

  return (
    <div className="Home">
      <header className="container">
        <h1>{mode === 'login' ? 'Login' : 'Register'}</h1>

        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} style={{ maxWidth: 420 }}>
          {mode === 'register' && (
            <div style={{ marginBottom: 12 }}>
              <label>Display name</label>
              <input className="bmi-input" value={displayName} onChange={e => setDisplayName(e.target.value)} />
            </div>
          )}
          <div style={{ marginBottom: 12 }}>
            <label>Email</label>
            <input className="bmi-input" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Password</label>
            <input className="bmi-input" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <button className="bmi-button-primary" type="submit">
            {mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>

        {msg && <p style={{ marginTop: 12 }}>{msg}</p>}

        <p style={{ marginTop: 16 }}>
          {mode === 'login' ? (
            <>No account? <button className="bmi-button-secondary" onClick={() => setMode('register')}>Register</button></>
          ) : (
            <>Have an account? <button className="bmi-button-secondary" onClick={() => setMode('login')}>Login</button></>
          )}
        </p>
      </header>
    </div>
  );
}
