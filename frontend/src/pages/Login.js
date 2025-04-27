import { useState, useEffect } from 'react';
import { loginUser } from '../api/auth';
import API_BASE_URL from '../config/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(email, password);

      if (res.success) {
        localStorage.setItem('token', res.token);
        window.location.href = '/';
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError('Login failed, please try again.');
    }
  };

  // GOOGLE SIGN-IN HANDLER
useEffect(() => {
  const initializeGoogleSignIn = () => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: '158994212931-136k02nkitfv56m4j7kt2v2obvoraotk.apps.googleusercontent.com',
        callback: (response) => handleGoogleCallback(response) // wrapping inside here
      });
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { theme: 'outline', size: 'large' }
      );
    }
  };

  initializeGoogleSignIn();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  const handleGoogleCallback = async (response) => {
    const id_token = response.credential;

    // Decode the ID token if needed
    const userInfo = parseJwt(id_token);

    if (userInfo) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/social/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: userInfo.sub,
            email: userInfo.email,
            name: userInfo.name
          })
        });

        const data = await res.json();

        if (data.success) {
          localStorage.setItem('token', data.token);
          window.location.href = '/';
        } else {
          setError(data.message || 'Google login failed');
        }
      } catch (err) {
        setError('Google login failed, please try again.');
      }
    }
  };

  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        <div id="googleSignInDiv"></div> {/* Google button will appear here */}
      </div>
    </>
  );
};

export default Login;
