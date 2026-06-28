import React, { createContext, useState } from "react";

export const CarContext = createContext();

export const CarProvider = ({ children }) => {
  const [selectedCar, setSelectedCar] = useState(null);
  const [cardetails, setCardetails] = useState([]);
  const [filters, setFilters] = useState({
    carType: [],
    transmission: [],
    fuelType: [],
    seats: [],
    modelYear: null,
    priceRange: [500, 7500],
  });
  const [isModelYearActive, setIsModelYearActive] = useState(false);

  return (
    <CarContext.Provider
      value={{
        selectedCar,
        setSelectedCar,
        cardetails,
        setCardetails,
        filters,
        setFilters,
        isModelYearActive,
        setIsModelYearActive
      }}
    >
      {children}
    </CarContext.Provider>
  );
};
