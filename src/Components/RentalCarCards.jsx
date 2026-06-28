import React, { useContext } from "react";
import "../Styling/RentalCarCards.css";
import { CarContext } from "./StateManagement";

export default function RentalCarCards({ carDetails}) {
  const { setSelectedCar } = useContext(CarContext);

  return (
    <div className="d-flex flex-wrap p-0 m-0">
      {carDetails.map((cardetail) => (
        <div key={cardetail.id} className="mx-4 mb-5">
          <div className="car-cards card" style={{ width: "fit-content", cursor: "pointer" }}
          onClick={() => setSelectedCar(cardetail)}
            >
            <div>
              <img
                src={`data:image/png;base64,${cardetail.imageData}`}
                alt=""
                style={{ width: "300px", height: "169px" }}
              />
              {/* car image */}
            </div>
            <div className="d-flex col-12">
              <div className="col-8 p-2">
                <p className="m-0" style={{ fontSize: "17px", fontWeight: "bold" }}>
                  {cardetail.brand} {/* Brand */}
                  <span>- {cardetail.carName}</span> {/* Car Name */}
                </p>
                <p style={{ fontSize: "17px", fontWeight: "bold" }}>
                  {cardetail.modelYear}
                </p>
                <div className="d-flex text-white" style={{ fontSize: "14px" }}>
                  <p className="m-0">{cardetail.transmission}</p>{" "}
                  {/* Transmission */}
                  <span className="px-1">.</span>
                  <p className="m-0"> {cardetail.fuelType}</p> {/* Fuel Type */}
                  <span className="px-1">.</span>
                  <p className="m-0">{cardetail.seats} Seater</p> {/* Seats */}
                </div>
              </div>
              <div className="col-4 d-flex justify-content-center align-items-center">
                <p className="" style={{ fontSize: "20px", fontWeight: "bold" }}>
                  {cardetail.rentalPrice}
                  <span className="fw-light" style={{ fontSize: "13px" }}>
                    /day
                  </span>
                </p>{" "}
                {/* price per hour */}
              </div>
            </div>
            <hr className="m-0" style={{ borderTop: "1px dotted" }} />
            <div>
              <p
                className=" m-2 px-1 mb-1 bg-body-secondary rounded-2"
                style={{ width: "fit-content", fontSize: "13px" }}
              >
                ACTIVE FASTAG
              </p>{" "}
              {/* FASTAG */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
