import { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    try {
      await dispatch(sessionActions.login(credential, password));
      closeModal();
    } catch (error) {
      if (error) {
        setError(true);
      }
    }
  };

  return (
    <div className="session-div">
      <h1>Log In</h1>
      {error === true && (
        <p className="error-text">The provided credentials were invalid</p>
      )}
      <form className="session-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="session-input"
          value={credential}
          placeholder="Username or Email"
          onChange={(e) => setCredential(e.target.value)}
          required
        />
        <input
          type="password"
          className="session-input"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="session-login"
          disabled={credential.length < 4 || password.length < 6}
        >
          Log In
        </button>
        <a
          className="demo-user"
          onClick={async () =>
            await dispatch(
              sessionActions.login("Demo-lition", "password")
            ).then(closeModal())
          }
        >
          Demo User
        </a>
      </form>
    </div>
  );
}

export default LoginFormModal;
