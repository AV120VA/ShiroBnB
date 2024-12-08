import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div className="logged-in-user">
        <li className="nav-button" onClick={() => navigate("/create-spot")}>
          Create a New Spot
        </li>
        <li className="profile-button">
          <ProfileButton user={sessionUser} />
        </li>
      </div>
    );
  } else {
    sessionLinks = (
      <>
        <li className="nav-button">
          <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
            className="nav-button"
          />
        </li>
        <li className="nav-button">
          <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
            className="nav-button"
          />
        </li>
      </>
    );
  }

  return (
    <div className="nav-container">
      <NavLink className="logo" to="/">
        <img className="logo-img" src="logo.png" alt="logo" />
      </NavLink>
      <ul className="button-box">{isLoaded && sessionLinks}</ul>
    </div>
  );
}

export default Navigation;
