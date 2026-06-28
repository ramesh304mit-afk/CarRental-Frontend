import React, { useEffect, useState } from "react";
import "../Styling/HomePage.css";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Slider from "@mui/material/Slider";
import RentalCarCards from "./RentalCarCards";
import { CarProvider } from "./StateManagement";
import CarDetailPopup from "./CarDetailPopup";

function valuetext(value) {
  return `${value}°C`;
}

export default function Homepage() {
  const [filters, setFilters] = useState({
    carType: [],
    transmission: [],
    fuelType: [],
    seats: [],
    modelYear: null,
    priceRange: [500, 7500],
  });

  const [cardetails, setCardetails] = useState([]);
  const [error, setError] = useState("");
  const [isModelYearActive, setIsModelYearActive] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => {
      setMobileFiltersOpen((prev) => {
        const newState = !prev;
        window.dispatchEvent(
          new CustomEvent("filters-state-changed", { detail: { open: newState } })
        );
        return newState;
      });
    };
    window.addEventListener("toggle-filters", handleToggle);
    return () => {
      window.removeEventListener("toggle-filters", handleToggle);
    };
  }, []);

  const closeMobileFilters = () => {
    setMobileFiltersOpen(false);
    window.dispatchEvent(
      new CustomEvent("filters-state-changed", { detail: { open: false } })
    );
  };

  // console.log(cardetails);

  useEffect(() => {
    const fetchCarDetails = async () => {
      setError("");
      try {
        const params = new URLSearchParams();
        if (filters.carType.length > 0) {
          params.append("carType", filters.carType.join(","));
        }
        if (filters.transmission.length > 0) {
          params.append("transmission", filters.transmission.join(","));
        }
        if (filters.fuelType.length > 0) {
          params.append("fuelType", filters.fuelType.join(","));
        }
        if (filters.seats.length > 0) {
          params.append("seats", filters.seats.join(","));
        }
        if (filters.modelYear !== null) {
          params.append("modelYear", filters.modelYear);
        }
        params.append("minPrice", filters.priceRange[0]);
        params.append("maxPrice", filters.priceRange[1]);
        const response = await fetch(
          `https://carrental-backend-9bti.onrender.com/api/CarDetails/filterImages?${params.toString()}`
        );
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Network response was not ok: ${response.status} ${response.statusText} - ${errorText}`
          );
        }
        const data = await response.json();
        setCardetails(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };
    fetchCarDetails();
  }, [
    filters.carType,
    filters.fuelType,
    filters.seats,
    filters.transmission,
    filters.modelYear,
    filters.priceRange,
  ]);

  const handleCheckboxChange = (e, category) => {
    const { name, checked } = e.target;
    setFilters((prevFilters) => {
      const selectedFilters = prevFilters[category];
      return checked
        ? { ...prevFilters, [category]: [...selectedFilters, name] }
        : {
            ...prevFilters,
            [category]: selectedFilters.filter((item) => item !== name),
          };
    });
  };

  const handleModelCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsModelYearActive(checked);
    if (!checked) {
      setFilters((prevFilters) => ({ ...prevFilters, modelYear: null }));
    }
  };

  const handleModelYearChange = (event, newValue) => {
    setFilters((prevFilters) => ({ ...prevFilters, modelYear: newValue }));
    setIsModelYearActive(true);
  };

  const handlePriceRangeChange = (event, newValue) => {
    setFilters((prevFilters) => ({ ...prevFilters, priceRange: newValue }));
  };
  return (
    <CarProvider>
      <div>
        <div className="homepagebackground"></div>
        <div className="homepagebody">
          {mobileFiltersOpen && (
            <div className="mobile-filter-overlay" onClick={closeMobileFilters}></div>
          )}
          <div className={`filter-side p-0 m-0 ${mobileFiltersOpen ? "mobile-open" : ""}`}>
            {/* Mobile-only Filter Drawer Header */}
            <div className="mobile-filter-header p-3 text-white border-bottom border-secondary">
              <span className="fw-bold fs-5">Filters</span>
              <button className="btn text-white p-0 fs-4" onClick={closeMobileFilters}>✖</button>
            </div>

            <h5 className="text-center col-12 greenbg text-dark p-3 m-0 fw-bold fs-4">
              Find Your Perfect Ride!
            </h5>

            <div className="col-12 d-flex flex-column align-items-center">
              <div
                className="accordion col-12 d-flex flex-column align-items-center"
                id="accordionPanelsStayOpenExample"
              >
                {/* Item-1 - Total Price */}
                <div className="accordion-item col-12 rounded-0 d-flex flex-column align-items-center border-0">
                  <h2
                    className="accordion-header col-11"
                    id="panelsStayOpen-headingThree"
                  >
                    <button
                      className="accordion-button bg-transparent rounded-0 shadow-none fs-5 fw-bold text-white"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseThree"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseThree"
                    >
                      ⭐TOTAL PRICE
                    </button>
                  </h2>

                  <div
                    id="panelsStayOpen-collapseThree"
                    className="accordion-collapse collapse show col-10"
                    aria-labelledby="panelsStayOpen-headingThree"
                  >
                    <div className="col-12 d-flex flex-column align-items-center">
                      <Box className="mt-4 col-8">
                        <Slider
                          value={filters.priceRange}
                          onChange={handlePriceRangeChange}
                          valueLabelDisplay="on"
                          getAriaValueText={valuetext}
                          step={100}
                          min={500}
                          max={3000}
                          valueLabelFormat={(value) => `Rs.${value}`}
                          sx={{
                            color: "#ffbb00",
                            "& .MuiSlider-rail": {
                              backgroundColor: "#bdbdbd", // Custom rail color
                            },
                            "& .MuiSlider-thumb": {
                              borderRadius: "0", // Square thumb
                              width: "8px", // Custom width if needed
                              height: "20px", // Custom height if needed
                              backgroundColor: "#ffbb00", // Thumb color
                            },
                            "& .MuiSlider-valueLabel": {
                              backgroundColor: "#ffbb00", // Background color for value label
                              color: "#ffffff",
                              padding: "4px", // Text color for value label
                            },
                            "&": {
                              padding: "0px", // Set padding to 0px for the slider root
                            },
                          }}
                        />
                      </Box>
                      <div className="p-0 m-0 mb-2 col-9 d-flex justify-content-between fw-bold fs-5">
                        <div>Near</div>
                        <div>Far</div>
                      </div>
                    </div>
                  </div>
                  <hr className="col-11 bg-transparent p-0 mt-0" />
                </div>

                {/* Item-2 - Car Details */}
                <div className="accordion-item col-12 rounded-0 d-flex flex-column align-items-center border-0">
                  <h2
                    className="accordion-header col-11"
                    id="panelsStayOpen-headingFour"
                  >
                    <button
                      className="accordion-button bg-transparent rounded-0 shadow-none fs-5 fw-bold text-white"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseFour"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseFour"
                    >
                      ⭐CAR DETAILS
                    </button>
                  </h2>

                  <div
                    id="panelsStayOpen-collapseFour"
                    className="accordion-collapse collapse show col-10"
                    aria-labelledby="panelsStayOpen-headingFour"
                  >
                    <div className="col-12 d-flex flex-column align-items-center">
                      <p className="col-11 mb-0 fw-bold fs-5">
                        Filter By Car Type
                      </p>
                      {/* Filter By Car Type */}
                      <div className="col-11 d-flex flex-column align-items-start">
                        {["SUV", "Sedan", "Hatchback", "Luxury"].map(
                          (carType) => (
                            <div
                              key={carType}
                              className="d-flex align-items-center"
                            >
                              <input
                                className="m-2"
                                style={{ width: "20px", height: "20px" }}
                                type="checkbox"
                                name={carType}
                                onChange={(e) =>
                                  handleCheckboxChange(e, "carType")
                                }
                              />
                              <label className="me-4 fw-light fs-5" htmlFor="">
                                {carType}
                              </label>
                            </div>
                          )
                        )}
                      </div>

                      <p className="col-11 mb-0 mt-3 fw-bold fs-5">
                        Filter By Transmission
                      </p>
                      {/* Filter By Transmission */}
                      <div className="col-11 d-flex flex-column align-items-start">
                        {["Manual", "Automatic"].map((transmission) => (
                          <div
                            key={transmission}
                            className="d-flex align-items-center"
                          >
                            <input
                              className="m-2"
                              style={{ width: "20px", height: "20px" }}
                              type="checkbox"
                              name={transmission}
                              onChange={(e) =>
                                handleCheckboxChange(e, "transmission")
                              }
                            />
                            <label className="me-4 fw-light fs-5" htmlFor="">
                              {transmission}
                            </label>
                          </div>
                        ))}
                      </div>

                      <p className="col-11 mb-0 mt-3 fw-bold fs-5">
                        Filter By Fuel Type
                      </p>
                      {/* Filter By Fuel Type */}
                      <div className="col-11 d-flex flex-column align-items-start">
                        {" "}
                        {["Diesel", "Petrol", "Electric"].map((fuelType) => (
                          <div
                            key={fuelType}
                            className="d-flex align-items-center"
                          >
                            <input
                              className="m-2"
                              style={{ width: "20px", height: "20px" }}
                              type="checkbox"
                              name={fuelType}
                              onChange={(e) =>
                                handleCheckboxChange(e, "fuelType")
                              }
                            />
                            <label className="me-4 fw-light fs-5" htmlFor="">
                              {fuelType}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <hr className="col-11 bg-transparent p-0 mt-0" />
                </div>

                {/* Item-3 - Seats */}
                <div className="accordion-item col-12 rounded-0 d-flex flex-column align-items-center border-0">
                  <h2
                    className="accordion-header col-11"
                    id="panelsStayOpen-headingFive"
                  >
                    <button
                      className="accordion-button bg-transparent rounded-0 shadow-none fs-5 fw-bold text-white"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseFive"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseFive"
                    >
                      ⭐SEATS
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseFive"
                    className="accordion-collapse collapse show col-10"
                    aria-labelledby="panelsStayOpen-headingFive"
                  >
                    <div className="col-12 d-flex flex-column align-items-center">
                      <div className="col-11 d-flex flex-column align-items-start">
                        {["2", "5", "7"].map((seats) => (
                          <div
                            key={seats}
                            className="d-flex align-items-center"
                          >
                            <input
                              className="m-2"
                              style={{ width: "20px", height: "20px" }}
                              type="checkbox"
                              name={seats}
                              onChange={(e) => handleCheckboxChange(e, "seats")}
                            />
                            <label className="me-4 fs-5" htmlFor="">
                              {`${seats} Seater`}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <hr className="col-11 bg-transparent p-0 mt-0" />
                </div>

                {/* Item-4 - Model Year */}
                <div className="accordion-item col-12 rounded-0 d-flex flex-column align-items-center border-0">
                  <h2
                    className="accordion-header col-11"
                    id="panelsStayOpen-headingSix"
                  >
                    <button
                      className="accordion-button bg-transparent rounded-0 shadow-none fs-5 fw-bold text-white"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseSix"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseSix"
                    >
                      ⭐MODEL YEAR
                    </button>
                  </h2>

                  <div
                    id="panelsStayOpen-collapseSix"
                    className="accordion-collapse collapse show col-10"
                    aria-labelledby="panelsStayOpen-headingSix"
                  >
                    {isModelYearActive && (
                      <div className="d-flex justify-content-end align-items-center mb-3">
                        <Chip
                          label="Cancel Filter"
                          onDelete={handleModelCheckboxChange} // Trigger when the close icon is clicked
                          sx={{
                            backgroundColor: "#ffbb00", // Custom chip color
                            color: "#ffffff", // Text color
                            fontWeight: "bold", // Bold text
                            ".MuiChip-deleteIcon": {
                              color: "#ffffff", // Close icon color
                            },
                            "&:hover": {
                              backgroundColor: "#ffa000", // Slightly darker on hover
                            },
                          }}
                        />
                      </div>
                    )}
                    <div className=" col-12 d-flex flex-column align-items-center">
                      <Box className="mt-4 col-8">
                        <Slider
                          aria-label="Small steps"
                          defaultValue={0.00000005}
                          step={1}
                          min={2000}
                          max={2024}
                          valueLabelDisplay="on"
                          value={filters.modelYear}
                          onChange={handleModelYearChange}
                          valueLabelFormat={(value) => `>${value}`}
                          sx={{
                            color: "#ffbb00",
                            "& .MuiSlider-rail": {
                              backgroundColor: "#bdbdbd", // Custom rail color
                            },
                            "& .MuiSlider-thumb": {
                              borderRadius: "0", // Square thumb
                              width: "8px", // Custom width if needed
                              height: "20px", // Custom height if needed
                              backgroundColor: "#ffbb00", // Thumb color
                            },
                            "& .MuiSlider-valueLabel": {
                              backgroundColor: "#ffbb00", // Background color for value label
                              color: "#ffffff",
                              padding: "4px",
                            },
                            "&": {
                              padding: "0px", // Set padding to 0px for the slider root
                            },
                          }}
                        />
                      </Box>

                      <div className="p-0 m-0 mb-2 col-10 d-flex justify-content-between fw-bold fs-5">
                        <div>2000</div>
                        <div>2024</div>
                      </div>
                    </div>
                  </div>

                  <hr className="col-11 bg-transparent p-0 mt-0" />
                </div>
              </div>
            </div>
          </div>

          <div className="carcardsside">
            <RentalCarCards carDetails={cardetails} />
            {/* {error && <p>Error: {error}</p>} */}
          </div>
        </div>
        <CarDetailPopup />
      </div>
    </CarProvider>
  );
}
