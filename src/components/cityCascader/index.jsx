import { useState, useEffect } from 'react';
import { Cascader, Modal } from 'antd';
import { fetchProvinces, fetchCitiesByProvince, translateName } from '@/apis/cityCascader';
import axios from 'axios';
import PropTypes from 'prop-types';

// Define the CityCascader component with a prop `onChange` for handling changes in selection.
export const CityCascader = ({ onChange }) => {
  // State hook for storing options for the cascader (provinces and cities).
  const [options, setOptions] = useState([]);
  // State hook for storing the currently selected location.
  const [selectedLocation, setSelectedLocation] = useState([]);

  // Effect hook to load provinces on component mount and fetch user's location.
  useEffect(() => {
    // Async function to load province options from an API.
    const loadProvinces = async () => {
      const provinces = await fetchProvinces();
      setOptions(provinces);
    };
  
    // Async function to fetch the user's current location based on IP and update the selected location.
    const fetchLocation = async () => {
      try {
        const response = await axios.get(`https://restapi.amap.com/v3/ip?key=<Your-API-Key>`);
        if (response.data.status === "1" && response.data.info === "OK") {
          const locationData = response.data;
          // Translate the province and city names to a preferred language or format.
          const translatedProvince = translateName(locationData.province);
          const translatedCity = translateName(locationData.city);
          const location = [translatedProvince, translatedCity];
          // Update the selected location state with the translated names.
          setSelectedLocation(location);
          // If an onChange handler is provided, call it with the new location.
          if (onChange) {
            onChange(location);
          }
        } else {
          // If the API indicates that the service is not available, show a warning modal.
          Modal.warning({
            title: 'Position Constraint',
            content: 'This service is only available to users in China.',
          });
        }
      } catch (error) {
        console.error('Failed to get user location:', error);
      }
    };
  
    // Call the functions to load initial data.
    loadProvinces();
    fetchLocation();
  }, []); // Empty dependency array means this effect runs only once on mount.
  
  // Function to load city options dynamically when a province is selected.
  const loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true; // Set loading state to true while fetching.

    // Fetch cities based on the selected province.
    const cities = await fetchCitiesByProvince(targetOption.label);
    // Update the target option with the fetched cities and remove the loading state.
    targetOption.children = cities;
    targetOption.loading = false;
    // Update the options state to trigger a re-render with the new cities.
    setOptions([...options]);
  };

  // Handler for when the location selection changes.
  const onLocationChange = (value) => {
    // Update the selected location state with the new value.
    setSelectedLocation(value);
    // If an onChange handler is provided, call it with the new value.
    if (onChange) {
      onChange(value);
    }
  };

  // Render the Cascader component with the necessary props for functionality.
  return (
    <Cascader
      options={options} // The options for provinces and their cities.
      loadData={loadData} // Function to call for dynamically loading city options.
      value={selectedLocation} // The currently selected location.
      onChange={onLocationChange} // Handler for when the selection changes.
      changeOnSelect // Allow changing selection on each level of the cascader.
    />
  );
};

// Type-checking for the `onChange` prop to ensure it's a function if provided.
CityCascader.propTypes = {
  onChange: PropTypes.func,
};
