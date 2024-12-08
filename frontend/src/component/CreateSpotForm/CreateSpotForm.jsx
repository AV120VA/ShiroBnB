import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateSpotForm.css";

function CreateSpotForm() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    name: "",
    description: "",
    price: null,
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/");
  };
  return (
    <div className="create-spot-container">
      <div className="create-spot-sub-container">
        <h2>Create a New Spot</h2>
        <div className="form-box "></div>
        <form onSubmit={handleSubmit} className="create-spot-form">
          <div className="location-box sub-box">
            <div className="text-box">
              <h3 className="section-heading">
                Where&apos;s your place located?
              </h3>
              <p className="section-text">
                Guests will only get your exact address once they booked a
                reservation.
              </p>
            </div>

            <label>
              Country
              <input
                type="text"
                name="country"
                value={formData.country}
                placeholder="Country"
                onChange={handleChange}
              />
            </label>
            <label>
              Street Address
              <input
                type="text"
                name="address"
                value={formData.address}
                placeholder="Address"
                onChange={handleChange}
              />
            </label>
            <div className="city-state-box">
              <div className="city-input-box">
                <label>
                  City
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    placeholder="City"
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className="state-input-box">
                <label>
                  State
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    placeholder="State"
                    onChange={handleChange}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="description-box sub-box">
            <h3 className="section-heading">Describe your place to guests</h3>
            <p className="section-text">
              Mention the best features of your space, any special amenities
              like fast wifi or parking, and what you love about the
              neighborhood.
            </p>
            <textarea
              className="description-input"
              type="text"
              name="description"
              value={formData.description}
              placeholder="Please write at least 30 characters"
              onChange={handleChange}
            />
          </div>
          <div className="title-box sub-box">
            <h3 className="section-heading">Create a title for your spot</h3>
            <p className="section-text">
              Catch a guest&apos;s attention with a spot title that highlights
              what makes your place special.
            </p>
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Name of your spot"
              onChange={handleChange}
            />
          </div>
          <div className="price-box sub-box">
            <h3 className="section-heading">Set a base price for your spot</h3>
            <p className="section-text">
              Competitive pricing can help your listing stand out and rank
              higher in search results.
            </p>
            <div className="price-input-box">
              <p className="money-sign">$</p>
              <input
                type="number"
                name="price"
                value={formData.price}
                placeholder="Price per night (USD)"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="photo-box sub-box">
            <h3 className="section-heading">Liven up your spot with photos</h3>
            <p className="section-text">
              Submit a link to at least one photo to publish your spot
            </p>
            <p>ASK ABOUT DATABASE MODIFICATIONS</p>
          </div>
          <div className="submit-box">
            <button className="submit-button" type="submit">
              Create a Spot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateSpotForm;
