import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return (
    <div className="signup-form-container">
      <h1>Sign Up</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="signup-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {errors.email && <p className="error-text">{errors.email}</p>}

        <input
          type="text"
          value={username}
          className="signup-input"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        {errors.username && <p className="error-text">{errors.username}</p>}

        <input
          type="text"
          className="signup-input"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        {errors.firstName && <p className="error-text">{errors.firstName}</p>}

        <input
          type="text"
          className="signup-input"
          value={lastName}
          placeholder="Last Name"
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        {errors.lastName && <p className="error-text">{errors.lastName}</p>}

        <input
          type="password"
          className="signup-input"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {errors.password && <p className="error-text">{errors.password}</p>}

        <input
          type="password"
          className="signup-input"
          value={confirmPassword}
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {errors.confirmPassword && (
          <p className="error-text">{errors.confirmPassword}</p>
        )}
        <button
          disabled={username.length < 4 || password.length < 6}
          className="signup-button"
          type="submit"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignupFormModal;
