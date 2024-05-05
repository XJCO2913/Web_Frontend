import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { TOUR_DETAILS_TABS, TOUR_PUBLISH_OPTIONS } from 'src/_mock';

import Label from 'src/components/label';
import { useSettingsContext } from 'src/components/settings';

import TourDetailsToolbar from '../tour-details-toolbar';
import TourDetailsContent from '../tour-details-content';
import TourDetailsBookers from '../tour-details-bookers';
import { useSnackbar } from 'src/components/snackbar';
import { axiosTest } from 'src/utils/axios';
import { endpoints } from 'src/api';
import { wgs2gcj, gcj2wgs } from 'src/utils/xml-shift'

// ----------------------------------------------------------------------

export default function TourDetailsView({ id }) {
  const settings = useSettingsContext();
  const { enqueueSnakebar } = useSnackbar()

  const [currentTab, setCurrentTab] = useState('content');
  const [currentTour, setCurrentTour] = useState({})
  const [path, setPath] = useState([])

  const [publish, setPublish] = useState(null);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handleChangePublish = useCallback((newValue) => {
    setPublish(newValue);
  }, []);

  const fetchCurrentTour = async () => {
    try {
      const resp = await axiosTest.get(`${endpoints.activity.getById}?activityID=${id}`);
      if (resp.data.status_code === 0) {
        setCurrentTour(resp.data.Data);
        
        // 假设 wgs2gcj 返回的是数组并且 media_gpx 也是数组
        const convertedPath = wgs2gcj(resp.data.Data.media_gpx);
        setPath(prev => [...prev, ...convertedPath]);
  
        setPublish('111');
      } else {
        enqueueSnakebar(resp.data.status_msg, { variant: "error" });
      }
    } catch (err) {
      enqueueSnakebar(err.toString(), { variant: "error" });
    }
  };
  
  useEffect(() => {
    fetchCurrentTour();
  }, []);  // 确保依赖项为空数组表示仅在组件挂载时执行
  

  const renderTabs = (
    <Tabs
      value={currentTab}
      onChange={handleChangeTab}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    >
      {TOUR_DETAILS_TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            tab.value === 'bookers' ? (
              <Label variant="filled">{currentTour?.participantsCount}</Label>
            ) : (
              ''
            )
          }
        />
      ))}
    </Tabs>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <TourDetailsToolbar
        backLink={paths.home.tour.root}
        liveLink="#"
        publish={publish}
        onChangePublish={handleChangePublish}
        publishOptions={TOUR_PUBLISH_OPTIONS}
        isJoined={currentTour.isRegistered}
        activityId={id}
      />
      {renderTabs}

      {currentTour && currentTab === 'content' && <TourDetailsContent tour={currentTour} />}

      {currentTab === 'bookers' && <TourDetailsBookers bookers={currentTour?.participants} media_gpx={path} />}
    </Container>
  );
}

TourDetailsView.propTypes = {
  id: PropTypes.string,
};
