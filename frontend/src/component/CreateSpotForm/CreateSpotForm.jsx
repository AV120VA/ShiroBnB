import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addSpot, addSpotImage } from "../../store/spots";
import "./CreateSpotForm.css";

function CreateSpotForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewURL] = useState("");
  const [imageUrls, setImageUrls] = useState(["", "", "", ""]);

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    name: "",
    description: "",
    price: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleUrlChange = (event, index) => {
    const { value } = event.target;

    if (index === undefined) {
      setPreviewURL(value);
    } else {
      const updatedImageUrls = [...imageUrls];
      updatedImageUrls[index] = value;
      setImageUrls(updatedImageUrls);
    }
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

    const urlRegex = /\.(png|jpg|jpeg)$/i;
    if (!previewUrl) {
      validationErrors.previewUrlRequired = "Preview image URL is required";
    }
    if (previewUrl && !urlRegex.test(previewUrl)) {
      validationErrors.previewUrlInvalid =
        "Image URL needs to end in png or jpg (or jpeg)";
    }

    imageUrls.forEach((url, index) => {
      if (url && !urlRegex.test(url)) {
        validationErrors[`imageUrl${index}`] =
          "Image URL needs to end in png or jpg (or jpeg)";
      }
    });

    setErrors(validationErrors);

    return Object.keys(validationErrors).length > 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      window.scrollTo(0, 0);
      return;
    }

    const newSpot = await dispatch(addSpot(formData));
    if (!newSpot.id) {
      if (newSpot.payload && newSpot.payload.errors) {
        setErrors(newSpot.payload.errors);
      }
      return;
    }

    if (previewUrl) {
      await dispatch(
        addSpotImage(newSpot.id, { url: previewUrl, preview: true })
      );
    }

    const imagePromises = imageUrls
      .filter((url) => url !== "")
      .map((url) => {
        return dispatch(addSpotImage(newSpot.id, { url, preview: false }));
      });

    await Promise.all(imagePromises);

    navigate(`/spots/${newSpot.id}`);
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
                    {errors.city && <p className="error-text">{errors.city}</p>}
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
            {errors.description && (
              <p className="error-text">
                Description needs a minimum of 30 characters
              </p>
            )}
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
            {errors.name && <p className="error-text">Name is required</p>}
          </div>
          <div className="sub-box">
            <h3 className="section-heading">Set a base price for your spot</h3>
            <p className="section-text">
              Competitive pricing can help your listing stand out and rank
              higher in search results.
            </p>
            <div className="price-input-box">
              <p className="money-sign">$</p>
              <input
                type="number"
                className="price-set"
                name="price"
                value={formData.price}
                placeholder="Price per night (USD)"
                onChange={handleChange}
              />
            </div>
            {errors.price && <p className="error-text">Price is required</p>}
          </div>
          <div className="photo-box sub-box">
            <h3 className="section-heading">Liven up your spot with photos</h3>
            <p className="section-text">
              Submit a link to at least one photo to publish your spot
            </p>
            <div className="photo-inputs">
              {errors.previewUrlRequired && (
                <p className="error-text">{errors.previewUrlRequired}</p>
              )}
              <input
                type="text"
                className="photo-input"
                value={previewUrl}
                placeholder="Preview Image Url"
                onChange={(event) => handleUrlChange(event, undefined)}
              />
              {errors.previewUrlInvalid && (
                <p className="error-text">{errors.previewUrlInvalid}</p>
              )}

              {imageUrls.map((url, index) => (
                <div key={index}>
                  <input
                    key={index}
                    type="text"
                    className="photo-input"
                    value={url}
                    placeholder="Image URL"
                    onChange={(event) => handleUrlChange(event, index)}
                  />
                  {errors[`imageUrl${index}`] && (
                    <p className="error-text">{errors[`imageUrl${index}`]}</p>
                  )}
                </div>
              ))}
            </div>
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
