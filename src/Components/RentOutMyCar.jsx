import React, { useState, useEffect, useRef } from "react";
import "../Styling/RentOutMyCar.css";
import { useNavigate } from "react-router-dom";

export default function RentOutMyCar() {
  //getting the loggined user details from cookies
  const getCookieValue = (name) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? decodeURIComponent(match[2]) : null;
  };

  const [user, setUser] = useState(null);

  const userDataString = getCookieValue("user");

  useEffect(() => {
    if (userDataString) {
      const Parsedata = JSON.parse(userDataString);
      setUser(Parsedata);
    } else {
      console.log("no parsedata");
    }
  }, [userDataString]);

  const [selectedBrand, setSelectedBrand] = useState("");
  const [carName, setCarName] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTransmission, setSelectedTransmission] = useState("");
  const [selectedSeats, setSelectedSeats] = useState("");
  const [selectedFuelType, setSelectedFuelType] = useState("");
  const [price, setPrice] = useState("500");
  const [imageFile, setImageFile] = useState(null);
  const [selectedCarType, setSelectedCarType] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [message, setMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const fileInputRef = useRef(null);
  
  const [showPopup, setShowPopup] = useState(false);


  const navigate = useNavigate();

  // Audio reference for the sound effect
  const ChooseAudioRef = useRef(null); // Create reference to the audio element

  const PlayChooseAudio = () => {
    if (ChooseAudioRef.current) {
      ChooseAudioRef.current.play();
    }
  };

  const SelectAudioRef = useRef(null); // Create reference to the audio element

  const PlaySelectAudio = () => {
    if (SelectAudioRef.current) {
      SelectAudioRef.current.play();
    }
  };

  const bmwAudioRef = useRef(null); // Create brand audio element
  const audiAudioRef = useRef(null);
  const porscheAudioRef = useRef(null);
  const MercedesBenzAudioRef = useRef(null);
  const NissanAudioRef = useRef(null);
  const JaguarAudioRef = useRef(null);
  const FordAudioRef = useRef(null);
  const KiaAudioRef = useRef(null);
  const LandRoverAudioRef = useRef(null);
  const MarutiSuzukiAudioRef = useRef(null);
  const MahindraAudioRef = useRef(null);
  const MGAudioRef = useRef(null);
  const SkodaAudioRef = useRef(null);
  const RenaultAudioRef = useRef(null);
  const TATAAudioRef = useRef(null);
  const ToyotaAudioRef = useRef(null);
  const VolkswagenAudioRef = useRef(null);

  const playBrandSound = (brand) => {
    if (brand === "BMW" && bmwAudioRef.current) {
      bmwAudioRef.current.play();
    } else if (brand === "Audi" && audiAudioRef.current) {
      audiAudioRef.current.play();
    } else if (brand === "Porsche" && porscheAudioRef.current) {
      porscheAudioRef.current.play();
    } else if (brand === "Mercedes-Benz" && MercedesBenzAudioRef.current) {
      MercedesBenzAudioRef.current.play();
    } else if (brand === "Nissan" && NissanAudioRef.current) {
      NissanAudioRef.current.play();
    } else if (brand === "Jaguar" && JaguarAudioRef.current) {
      JaguarAudioRef.current.play();
    } else if (brand === "Ford" && FordAudioRef.current) {
      FordAudioRef.current.play();
    } else if (brand === "Kia" && KiaAudioRef.current) {
      KiaAudioRef.current.play();
    } else if (brand === "Land Rover" && LandRoverAudioRef.current) {
      LandRoverAudioRef.current.play();
    } else if (brand === "Maruti Suzuki" && MarutiSuzukiAudioRef.current) {
      MarutiSuzukiAudioRef.current.play();
    } else if (brand === "Mahindra" && MahindraAudioRef.current) {
      MahindraAudioRef.current.play();
    } else if (brand === "MG" && MGAudioRef.current) {
      MGAudioRef.current.play();
    } else if (brand === "Skoda" && SkodaAudioRef.current) {
      SkodaAudioRef.current.play();
    } else if (brand === "Renault" && RenaultAudioRef.current) {
      RenaultAudioRef.current.play();
    } else if (brand === "TATA" && TATAAudioRef.current) {
      TATAAudioRef.current.play();
    } else if (brand === "Volkswagen" && VolkswagenAudioRef.current) {
      VolkswagenAudioRef.current.play();
    } else if (brand === "Toyota" && ToyotaAudioRef.current) {
      ToyotaAudioRef.current.play();
    }

    // Add conditions for other brands
  };

  const [showBrandOptions, setShowBrandOptions] = useState(false);
  const [showYearOptions, setShowYearOptions] = useState(false);
  const [showTransmissionOptions, setShowTransmissionOptions] = useState(false);
  const [showSeatsOptions, setShowSeatsOptions] = useState(false);
  const [showFuelOptions, setShowFuelOptions] = useState(false);
  const [showPriceOptions, setShowPriceOptions] = useState(false);
  const [showCarTypeOptions, setShowCarTypeOptions] = useState(false);

  useEffect(() => {
    // Check if all required fields are filled
    const isFilled = [
      selectedBrand,
      carName,
      selectedYear,
      selectedTransmission,
      selectedSeats,
      selectedFuelType,
      price,
      selectedCarType,
      imageFile,
    ].every((field) => field && field.toString().trim() !== "");
    setIsFormValid(isFilled);
  }, [
    selectedBrand,
    carName,
    selectedYear,
    selectedTransmission,
    selectedSeats,
    selectedFuelType,
    price,
    selectedCarType,
    imageFile,
  ]);

  const handleClick = (index) => {
    setSelectedIndex(index);
    setShowBrandOptions(index === 0);
    setShowYearOptions(index === 2);
    setShowTransmissionOptions(index === 3);
    setShowSeatsOptions(index === 4);
    setShowFuelOptions(index === 5);
    setShowPriceOptions(index === 6);
    setShowCarTypeOptions(index === 7);
    PlayChooseAudio();
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1990 + 1 },
    (_, index) => 1990 + index
  );

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      setMessage("Please upload an image.");
      setShowPopup(true);
      return;
    }

    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);

    // Prepare form data
    const data = new FormData();
    data.append("imageFile", imageFile);
    data.append("brand", selectedBrand);
    data.append("carName", carName);
    data.append("modelYear", selectedYear);
    data.append("transmission", selectedTransmission);
    data.append("seats", selectedSeats);
    data.append("fuelType", selectedFuelType);
    data.append("carType", selectedCarType);
    data.append("rentalPrice", price);
    data.append("signupEmailID", user.email);
    data.append("userName", user.userName);

    try {
      // Make the POST request to the backend using fetch
      const response = await fetch(
        "https://carrental-backend-9bti.onrender.com/api/CarDetails/upload",
        {
          method: "POST",
          body: data,
        }
      );

      if (response.ok) {
        const result = await response.text();
        setMessage(result);
        setShowPopup(true);

        // Reset all fields after successful submission
        setSelectedBrand("");
        setCarName("");
        setSelectedYear("");
        setSelectedTransmission("");
        setSelectedSeats("");
        setSelectedFuelType("");
        setPrice("");
        setImageFile(null);
        setSelectedCarType("");
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Clear the file input field
        }
      } else {
        const errorText = await response.text();
        setMessage(`Error: ${errorText}`);
        setShowPopup(true);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setShowPopup(true);
    }
  };

  return (
    <div className="bg-black" style={{ display: "flex" }}>
      <div className="cus-cars">
        <div className="p-2 fs-4 fw-bold bg-light text-dark">
          Upload Car Details
        </div>
        <div className="fs-5 fw-bolder text-light">
          {[
            "Select Brand",
            "Car Name",
            "Model Year",
            "Transmission",
            "Seats",
            "Fuel Type",
            "Price",
            "Car Type",
          ].map((label, index) => (
            <div
              key={index}
              className={`py-2 car-spec row ${
                selectedIndex === index ? "active" : ""
              }`}
              onClick={() => handleClick(index)}
            >
              <span className="col-7 px-0">⭐{label}:</span>
              <span className="col-5 overflow-hidden">
                {label === "Price" && price && `₹ ${price}/day`}
                {label === "Select Brand" &&
                  selectedBrand &&
                  `  ${selectedBrand}`}
                {label === "Car Name" && (
                  <input
                    type="text"
                    value={carName}
                    onChange={(e) => setCarName(e.target.value)}
                    className={
                      selectedIndex === index
                        ? "input-active"
                        : "input-inactive"
                    }
                  />
                )}
                {label === "Model Year" && selectedYear && `  ${selectedYear}`}
                {label === "Transmission" &&
                  selectedTransmission &&
                  ` ${selectedTransmission}`}
                {label === "Seats" && selectedSeats && ` ${selectedSeats}`}
                {label === "Fuel Type" &&
                  selectedFuelType &&
                  ` ${selectedFuelType}`}
                {label === "Car Type" &&
                  selectedCarType &&
                  `  ${selectedCarType}`}
              </span>
            </div>
          ))}
        </div>

        <div className="row py-2">
          <label className="col-5 fs-5 fw-bolder text-light ">
            ⭐Car Image
          </label>
          <input
            className="col-7 file-input overflow-hidden"
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            ref={fileInputRef}
          />
        </div>
        <div className="d-flex justify-content-center m-4">
          <button
            className={`car-submit ${isClicked ? "clicked" : ""}`}
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            submit
          </button>
        </div>
        {/* {message && <p>{message}</p>} */}

        {/* Audio Element */}
        <audio ref={ChooseAudioRef}>
          <source src="/SoundEffects/ChooseSoundEffect.mp3" type="audio/mpeg" />
        </audio>

        <audio ref={SelectAudioRef}>
          <source src="/SoundEffects/SelectSoundEffect.mp3" type="audio/mpeg" />
        </audio>

        <audio ref={bmwAudioRef}>
          <source src="/SoundEffects/BMWSoundEffect.mp3" type="audio/mpeg" />
        </audio>
        <audio ref={audiAudioRef}>
          <source src="/SoundEffects/AudiSoundEffect.mp3" type="audio/mpeg" />
        </audio>
        <audio ref={porscheAudioRef}>
          <source
            src="/SoundEffects/PorscheSoundEffect.mp3"
            type="audio/mpeg"
          />
        </audio>
        <audio ref={MercedesBenzAudioRef}>
          <source
            src="/SoundEffects/Mercedes-BenzSoundEffect.mp3"
            type="audio/mpeg"
          />
        </audio>
        <audio ref={NissanAudioRef}>
          <source src="/SoundEffects/NissanSoundEffect.mp3" type="audio/mpeg" />
        </audio>
        <audio ref={JaguarAudioRef}>
          <source src="/SoundEffects/JaguarSoundEffect.mp3" type="audio/mpeg" />
        </audio>
        <audio ref={FordAudioRef}>
          <source src="/SoundEffects/FordSoundEffect.mp3" type="audio/mpeg" />
        </audio>
        <audio ref={KiaAudioRef}>
          <source src="/SoundEffects/KiaSoundEffect.mp3" type="audio/mpeg" />
        </audio>
        <audio ref={LandRoverAudioRef}>
          <source
            src="/SoundEffects/LandRoverSoundEffect.mp3"
            type="audio/mpeg"
          />
        </audio>
        <audio ref={MarutiSuzukiAudioRef}>
          <source
            src="/SoundEffects/MarutiSuzukiSoundEffect.mp3"
            type="audio/mpeg"
          />
        </audio>
        <audio ref={MahindraAudioRef}>
          <source
            src="/SoundEffects/MahindraSoundEffect.mp3"
            type="audio/mpeg"
          />
        </audio>
        <audio ref={MGAudioRef}>
          <source src="/SoundEffects/MGSoundEffect.mp3" type="audio/mpeg" />
        </audio>
        <audio ref={SkodaAudioRef}>
          <source src="/SoundEffects/SkodaSoundEffect.mp3" type="audio/mpeg" />
        </audio>
        <audio ref={RenaultAudioRef}>
          <source
            src="/SoundEffects/RenaultSoundEffect.mp3"
            type="audio/mpeg"
          />
        </audio>
        <audio ref={TATAAudioRef}>
          <source src="/SoundEffects/TATASoundEffect.mp3" type="audio/mpeg" />
        </audio>
        <audio ref={ToyotaAudioRef}>
          <source src="/SoundEffects/ToyotaSoundEffect.mp3" type="audio/mpeg" />
        </audio>
        <audio ref={VolkswagenAudioRef}>
          <source
            src="/SoundEffects/VolkswagenSoundEffect.mp3"
            type="audio/mpeg"
          />
        </audio>
      </div>

      {showBrandOptions && (
        <div className="brand-options-box ms-3 text-dark">
          <div className="fs-4 p-2 fw-bold bg-black text-light">
            Select Brand
          </div>
          {[
            "Audi",
            "BMW",
            "Ford",
            "Jaguar",
            "Kia",
            "Land Rover",
            "Mahindra",
            "Maruti Suzuki",
            "Mercedes-Benz",
            "MG",
            "Nissan",
            "Porsche",
            "Renault",
            "Skoda",
            "TATA",
            "Toyota",
            "Volkswagen",
          ].map((brand) => (
            <div
              key={brand}
              className="py-2 fs-5 fw-bolder car-spec-options"
              onClick={() => {
                setShowBrandOptions(false);
                setSelectedBrand(brand);
                playBrandSound(brand);
              }}
            >
              <span>⭐</span> {brand}
            </div>
          ))}
        </div>
      )}

      {showYearOptions && (
        <div className="year-options-box ms-3 text-dark">
          <div className="fs-4 p-2 fw-bold bg-black text-light sticky-top">
            Select Model Year
          </div>
          {years.map((year) => (
            <div
              key={year}
              className="py-2 fs-5 fw-bolder car-spec-options"
              onClick={() => {
                setShowYearOptions(false);
                setSelectedYear(year);
                PlaySelectAudio();
              }}
            >
              <span>⭐</span>
              {year}
            </div>
          ))}
        </div>
      )}

      {showTransmissionOptions && (
        <div className="transmission-options-box ms-3 text-dark">
          <div className="fs-4 p-2 fw-bold bg-black text-light">
            Select Transmission
          </div>
          {["Manual", "Automatic"].map((transmission) => (
            <div
              key={transmission}
              className="py-2 fs-5 fw-bolder car-spec-options"
              onClick={() => {
                setShowTransmissionOptions(false);
                setSelectedTransmission(transmission);
                PlaySelectAudio();
              }}
            >
              <span>⭐</span> {transmission}
            </div>
          ))}
        </div>
      )}

      {showSeatsOptions && (
        <div className="seats-options-box ms-3 text-dark">
          <div className="fs-4 p-2 fw-bold bg-black text-light">
            Select Seats
          </div>
          {["2", "5", "7"].map((seats) => (
            <div
              key={seats}
              className="py-2 fs-5 fw-bolder car-spec-options"
              onClick={() => {
                setShowSeatsOptions(false);
                setSelectedSeats(seats);
                PlaySelectAudio();
              }}
            >
              <span>⭐</span> {seats}
            </div>
          ))}
        </div>
      )}

      {showFuelOptions && (
        <div className="fuel-options-box ms-3 text-dark">
          <div className="fs-4 p-2 fw-bold bg-black text-light">
            Select Fuel Type
          </div>
          {["Petrol", "Diesel", "Electric"].map((fuel) => (
            <div
              key={fuel}
              className="py-2 fs-5 fw-bolder car-spec-options"
              onClick={() => {
                setShowFuelOptions(false);
                setSelectedFuelType(fuel);
                PlaySelectAudio();
              }}
            >
              <span>⭐</span> {fuel}
            </div>
          ))}
        </div>
      )}

      {showCarTypeOptions && (
        <div className="car-type-options-box ms-3 text-dark">
          <div className="fs-4 p-2 fw-bold bg-black text-light">
            Select Car Type
          </div>
          {["SUV", "Sedan", "Hatchback", "Luxury"].map((carType) => (
            <div
              key={carType}
              className="py-2 fs-5 fw-bolder car-spec-options"
              onClick={() => {
                setShowCarTypeOptions(false);
                setSelectedCarType(carType);
                PlaySelectAudio();
              }}
            >
              <span>⭐</span> {carType}
            </div>
          ))}
        </div>
      )}

      {showPriceOptions && (
        <div className="price-slider-box ms-3 text-light">
          <div className="fs-4 p-2 fw-bold bg-black text-light">
            Select Price
          </div>
          <div className="row mt-5">
            <div className="col-12 d-flex justify-content-center">
              <input
                type="range"
                min="500"
                max="3000"
                step="50"
                value={price}
                onChange={handlePriceChange}
                className="slider-range"
              />
            </div>
            <div className="py-2 fs-5 fw-bolder text-center">{`Selected Price: ₹ ${price}`}</div>
          </div>
        </div>
      )}

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p className="text-white">{message}</p>
            <button className="" onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}
      {/* if not logged-in. popup will show */}
      {!user && (
        <div className="popup-overlay">
          <div className="popup">
            <p className="text-white">Please login</p>
            <button className="" onClick={() => navigate("/LoginPage")}>
              Login
            </button>
            <p className="text-white">
              Don't have account?{" "}
              <span
                onClick={() => navigate("/SignupPage")}
                style={{
                  cursor: "pointer",
                  textDecoration: "lined",
                  color: "lightblue",
                }}
              >
                signup
              </span>
            </p>
            <p
              className="text-start text-warning mb-0"
              onClick={() => navigate("/")}
            >
              Close
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
