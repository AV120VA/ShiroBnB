import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotById } from "../../store/spots";
import "./UpdateSpotForm.css";

function UpdateSpotForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const spot = useSelector((state) => state.spots.spotById);

  const [isLoaded, setIsLoaded] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    dispatch(getSpotById(spotId))
      .then(() => setIsLoaded(true))
      .then(() =>
        setFormData({
          address: spot.address || "",
          city: spot.city || "",
          state: spot.state || "",
          country: spot.country || "",
          name: spot.name,
          description: spot.description || "",
          price: spot.price || "",
        })
      );
  }, [dispatch, spotId, spot]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const validateForm = () => {
    const validationErrors = {};

    if (!formData.country) validationErrors.country = "Country is required";
    if (!formData.address) validationErrors.address = "Address is required";
    if (!formData.city) validationErrors.city = "City is required";
    if (!formData.state) validationErrors.state = "State is required";
    if (!formData.name) validationErrors.name = "Name is required";
    if (formData.description.length < 30)
      validationErrors.description =
        "Description need a minimum of 30 characters";
    if (!formData.price) validationErrors.price = "Price is required";

    setErrors(validationErrors);

    return Object.keys(validationErrors).length > 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      window.scrollTo(0, 0);
      return;
    } else {
      navigate(`/spots/${spot.id}`);
    }
  };
  return (
    <>
      {isLoaded && formData && (
        <div className="create-spot-container">
          <div className="create-spot-sub-container">
            <h2>Update Your Spot</h2>
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
                <div className="label-error-box">
                  <p className="label-text">
                    Country{" "}
                    {errors.country && (
                      <p className="error-text">{errors.country}</p>
                    )}
                  </p>
                </div>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  placeholder="Country"
                  onChange={handleChange}
                />

                <div className="label-error-box">
                  <p className="label-text">
                    Street Address{" "}
                    {errors.address && (
                      <p className="error-text">{errors.address}</p>
                    )}
                  </p>
                </div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  placeholder="Address"
                  onChange={handleChange}
                />

                <div className="city-state-box">
                  <div className="city-input-box">
                    <div className="label-error-box">
                      <p className="label-text">
                        City{" "}
                        {errors.city && (
                          <p className="error-text">{errors.city}</p>
                        )}
                      </p>
                    </div>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      placeholder="City"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="state-input-box">
                    <div className="label-error-box">
                      <p className="label-text">
                        State{" "}
                        {errors.state && (
                          <p className="error-text">{errors.state}</p>
                        )}
                      </p>
                    </div>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      placeholder="State"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="description-box sub-box">
                <h3 className="section-heading">
                  Describe your place to guests
                </h3>
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
                {errors.description && (
                  <p className="error-text">
                    Description needs a minimum of 30 characters
                  </p>
                )}
              </div>
              <div className="title-box sub-box">
                <h3 className="section-heading">
                  Create a title for your spot
                </h3>
                <p className="section-text">
                  Catch a guest&apos;s attention with a spot title that
                  highlights what makes your place special.
                </p>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  placeholder="Name of your spot"
                  onChange={handleChange}
                />
                {errors.name && <p className="error-text">Name is required</p>}
              </div>
              <div className="price-box sub-box">
                <h3 className="section-heading">
                  Set a base price for your spot
                </h3>
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
                {errors.price && (
                  <p className="error-text">Price is required</p>
                )}
              </div>
              <div className="submit-box">
                <button className="submit-button" type="submit">
                  Update Your Spot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default UpdateSpotForm;
