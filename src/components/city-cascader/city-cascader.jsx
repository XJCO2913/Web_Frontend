import { useState, useEffect, forwardRef } from 'react';
import { Cascader, ConfigProvider } from 'antd';
import Alert from '@mui/material/Alert';
import { fetchProvinces, fetchCitiesByProvince, translateName } from './utils';
import axios from 'axios';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { GAODE_API } from 'src/api/index';

// ----------------------------------------------------------------------
const StyledCascader = styled(Cascader)`
  width: 100%;
  height: 100%;
`;

// ----------------------------------------------------------------------
export const CityCascader = forwardRef(({ onChange, error, errorMessage, shouldFetchData, valueArr, autoIP }, ref) => {
  // State hook for storing options for the cascader (provinces and cities).
  const [options, setOptions] = useState([]);
  // State hook for storing the currently selected location.
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertType, setAlertType] = useState('info'); // 'error', 'warning', 'info', 'success'
  const [alertMessage, setAlertMessage] = useState('');
  const [open, setOpen] = useState(true);

  // ----------------------------------------------------------------------
  // Async function to load province options from an API.
  useEffect(() => {
    const loadProvinces = async () => {
      const provinces = await fetchProvinces();
      setOptions(provinces);
    };

    loadProvinces();
    if (valueArr && valueArr.length) {
      setSelectedLocation(valueArr);
      if (onChange) {
        onChange(valueArr);
      }
    }
  }, [shouldFetchData]);

  // ----------------------------------------------------------------------

  // Effect hook to load provinces on component mount and fetch user's location.
  useEffect(() => {
    // A function that displays a prompt message
    const showAlert = (type, message) => {
      setAlertType(type);
      setAlertMessage(message);
      setOpenAlert(true);
    };

    // ----------------------------------------------------------------------
    const fetchLocation = async () => {
      try {
        const response = await axios.get(`${GAODE_API.apiIP}${GAODE_API.apiKey}`);
        if (
          response.data.status === "1" &&
          response.data.info === "OK" &&
          response.data.province && response.data.province.length > 0 &&
          response.data.city && response.data.city.length > 0
        ) {
          const locationData = response.data;
          const translatedProvince = translateName(locationData.province);
          const translatedCity = translateName(locationData.city);
          const location = [translatedProvince, translatedCity];
          setSelectedLocation(location);
          if (onChange) {
            onChange(location);
          }
        } else {
          // when IP is not in China show the alert
          showAlert('warning', 'This service is only available to users in China.');
        }
      } catch (error) {
        console.error('Failed to get user location:', error);
        showAlert('error', 'An error occurred when trying to get user location.');
      }
    };

    if (autoIP && shouldFetchData) {
      fetchLocation();
    }
  }, [autoIP,shouldFetchData]);

  // ----------------------------------------------------------------------
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
    <>
      {openAlert && (
        <Alert severity={alertType} onClose={() => setOpenAlert(false)}>
          {alertMessage}
        </Alert>
      )}

      {error && open &&
        (<Alert
          severity="error"
          onClose={() => setOpen(false)}>
          {errorMessage}
        </Alert>)}

      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#000000',
            colorPrimaryHover: '#000000',
            fontFamily: 'ublic Sans,sans-serif',
            fontSize: 13
          },
          components: {
            Cascader: {
              controlItemWidth: 1,
              controlWidth: 1,
              optionSelectedBg: '#e6f4ff'
            },
          }
        }}
      >
        <StyledCascader
          ref={ref}
          size='large'
          options={options} // The options for provinces and their cities.
          loadData={loadData} // Function to call for dynamically loading city options.
          value={selectedLocation} // The currently selected location.
          onChange={onLocationChange} // Handler for when the selection changes.
          changeOnSelect // Allow changing selection on each level of the cascader.
          placeholder='select your reigon'
          dropdownMenuColumnStyle={{ width: "100%", maxWidth: "250px" }}
        />
      </ConfigProvider></>
  );
});
CityCascader.displayName = 'CityCascader';

// Type-checking for the `onChange` prop to ensure it's a function if provided.
CityCascader.propTypes = {
  onChange: PropTypes.func,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  shouldFetchData: PropTypes.bool,
  value: PropTypes.string,
  autoIP: PropTypes.bool,
  valueArr: PropTypes.array,
};

export default CityCascader;