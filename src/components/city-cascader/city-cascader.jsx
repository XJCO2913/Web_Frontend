import { useState, useEffect } from 'react';
import { Cascader, ConfigProvider } from 'antd';
import Alert from '@mui/material/Alert';
import { fetchProvinces, fetchCitiesByProvince, translateName } from '@/apis/cityCascader';
import axios from 'axios';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledCascader = styled(Cascader)`
  width: 100%;
  height: 100%;
`;

// Define the CityCascader component with a prop `onChange` for handling changes in selection.
export const CityCascader = ({ onChange }) => {
  // State hook for storing options for the cascader (provinces and cities).
  const [options, setOptions] = useState([]);
  // State hook for storing the currently selected location.
  const [selectedLocation, setSelectedLocation] = useState([]);

  const [openAlert, setOpenAlert] = useState(false);
  const [alertType, setAlertType] = useState('info'); // 'error', 'warning', 'info', 'success'
  const [alertMessage, setAlertMessage] = useState('');

  // Effect hook to load provinces on component mount and fetch user's location.
  useEffect(() => {
    // Async function to load province options from an API.
    const loadProvinces = async () => {
      const provinces = await fetchProvinces();
      setOptions(provinces);
    };

    // 显示提示信息的函数
    const showAlert = (type, message) => {
      setAlertType(type);
      setAlertMessage(message);
      setOpenAlert(true);
    };

    const fetchLocation = async () => {
      try {
        const response = await axios.get(`https://restapi.amap.com/v3/ip?key=03eceb9420e057a98616285039c15367`);
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
          // 服务不可用或数据为空
          showAlert('warning', 'This service is only available to users in China.');
        }
      } catch (error) {
        console.error('Failed to get user location:', error);
        showAlert('error', 'An error occurred when trying to get user location.');
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
    <>
      {openAlert && (
        <Alert severity={alertType} onClose={() => setOpenAlert(false)}>
          {alertMessage}
        </Alert>
      )}

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
              controlItemWidth: 55,
              optionSelectedBg: '#e6f4ff'
            },
          }
        }}
      >
        <StyledCascader
          size='large'
          options={options} // The options for provinces and their cities.
          loadData={loadData} // Function to call for dynamically loading city options.
          value={selectedLocation} // The currently selected location.
          onChange={onLocationChange} // Handler for when the selection changes.
          changeOnSelect // Allow changing selection on each level of the cascader.
          placeholder='select your reigon'
        />
      </ConfigProvider></>
  );
};

// Type-checking for the `onChange` prop to ensure it's a function if provided.
CityCascader.propTypes = {
  onChange: PropTypes.func,
};

export default CityCascader;