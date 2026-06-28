import React, { useEffect, useState, useRef } from "react";
import "../Styling/RentalCarCards.css";
import "../Styling/UserDashboard.css";

export default function UserDashboard() {
  // Getting the logged-in user details from cookies
  const getCookieValue = (name) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? decodeURIComponent(match[2]) : null;
  };

  const [user, setUser] = useState({});
  const userDataString = getCookieValue("user");

  useEffect(() => {
    if (userDataString) {
      const parsedData = JSON.parse(userDataString);
      setUser(parsedData);
    } else {
      console.log("No parsed data");
    }
  }, [userDataString]);

  const [carDetails, setCarDetails] = useState([]);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      if (!user || !user.email) {
        setError("User email not found");
        return;
      }

      try {
        const response = await fetch(
          `https://localhost:7189/api/CarDetails/getImagesByEmail?email=${user.email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCarDetails(data); // Set images data based on user email
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      }
    };

    if (user.email) {
      fetchImages();
    }
  }, [user.email, user,carDetails]);

  const fileInputRef = useRef(null); // Ref for file input
  const [selectedFile, setSelectedFile] = useState(null);
  const [carToUpdate, setCarToUpdate] = useState(null);

  const handleImageUpload = (event, carId) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setCarToUpdate(carId); // Set the ID of the car to be updated
  };

  const handleSaveImage = async () => {
    if (!selectedFile || !carToUpdate) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("ImageData", selectedFile); // Image file
    formData.append("Id", carToUpdate); // Car ID to update

    try {
      const response = await fetch(
        "https://localhost:7189/api/CarDetails/UpdateCarImageData",
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        const contentType = response.headers.get("Content-Type");

        if (contentType && contentType.includes("application/json")) {
          const result = await response.json();
          console.log("Car image updated successfully", result);
          alert(result);

          // Update the car image in the UI
          setCarDetails((prevDetails) =>
            prevDetails.map((carDetail) =>
              carDetail.id === carToUpdate
                ? { ...carDetail, imageData: result.imageData }
                : carDetail
            )
          );
        } else {
          const textResult = await response.text();
          console.log("Car image updated successfully: ", textResult);
        }

        setSelectedFile(null);
        setCarToUpdate(null);
      } else {
        alert("Failed to update car image. Please try again.");
      }
    } catch (error) {
      console.error("Error updating car image:", error);
      alert("An error occurred while updating the car image.");
    }
  };

  const confirmDelete = (carDetail) => {
    setCarToDelete(carDetail);
    setShowPopup(true);
  };

  const handleDelete = async () => {
    if (!carToDelete) return;

    try {
      const response = await fetch(
        `https://localhost:7189/api/CarDetails/delete/${carToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Remove the deleted car from the state
      setCarDetails(
        carDetails.filter((carDetail) => carDetail.id !== carToDelete.id)
      );
      setShowPopup(false); // Hide the popup after deletion
      setCarToDelete(null); // Reset the car to delete
    } catch (err) {
      setError(err.message);
      console.error("Delete error:", err);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="user-dashboard">
      <p className="mycars-title">MY CARS</p>
      <div className="usercarcardsside">
        <div className="d-flex flex-wrap justify-content-center p-0 m-0">
          {carDetails.map((carDetail) => (
            <div key={carDetail.id} className="mx-4 mb-5">
              <div className="car-cards card" style={{ width: "fit-content" }}>
                <div>
                  <div className="car-pic">
                    <img
                      src={`data:image/png;base64,${carDetail.imageData}`}
                      alt=""
                      style={{ width: "300px", height: "169px" }}
                    />
                    <div
                      className="car-image-edit-icon"
                      onClick={() => fileInputRef.current.click()} // Trigger file input on click
                    >
                      ✎
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleImageUpload(e, carDetail.id)}
                  />
                </div>
                <div className="d-flex col-12">
                  <div className="col-8 p-2">
                    <p
                      className="m-0"
                      style={{ fontSize: "17px", fontWeight: "bold" }}
                    >
                      {carDetail.brand}
                      <span>- {carDetail.carName}</span>
                    </p>
                    <p style={{ fontSize: "17px", fontWeight: "bold" }}>
                      {carDetail.modelYear}
                    </p>
                    <div
                      className="d-flex text-white"
                      style={{ fontSize: "14px" }}
                    >
                      <p className="m-0">{carDetail.transmission}</p>
                      <span className="px-1">.</span>
                      <p className="m-0"> {carDetail.fuelType}</p>
                      <span className="px-1">.</span>
                      <p className="m-0">{carDetail.seats} Seater</p>
                    </div>
                  </div>
                  <div className="col-4 d-flex justify-content-center align-items-center">
                    <p
                      className=""
                      style={{ fontSize: "20px", fontWeight: "bold" }}
                    >
                      {carDetail.rentalPrice}
                      <span className="fw-light" style={{ fontSize: "13px" }}>
                        /day
                      </span>
                    </p>
                  </div>
                </div>
                <hr className="m-0" style={{ borderTop: "1px dotted" }} />
                <div className="d-flex justify-content-between">
                  <p
                    className="m-2 px-1 mb-1 bg-body-secondary rounded-2"
                    style={{ width: "fit-content", fontSize: "13px" }}
                  >
                    ACTIVE FASTAG
                  </p>
                  <button
                    className="car-delete-button"
                    onClick={() => confirmDelete(carDetail)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p className="text-white">
              Are you sure you want to delete this car?
            </p>
            <button className="m-1" onClick={handleDelete}>
              Yes
            </button>
            <button className="m-1" onClick={() => setShowPopup(false)}>
              No
            </button>
          </div>
        </div>
      )}

{selectedFile && (
        <div className="popup-overlay">
          <div className="popup">
            <p className="text-white">
              Are you sure you want to change your car image?
            </p>
            <button className="m-1" onClick={handleSaveImage}>
              Yes
            </button>
            <button className="m-1" onClick={() => setSelectedFile(null)}>
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
