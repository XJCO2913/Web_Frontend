import orderBy from 'lodash/orderBy';
import { useState, useCallback, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { isAfter, isBetween } from 'src/utils/format-time';

import { countries } from 'src/assets/data';
import { _tours, _tourGuides, TOUR_SORT_OPTIONS, TOUR_SERVICE_OPTIONS } from 'src/_mock';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TourList from '../tour-list';
import TourSort from '../tour-sort';
import TourSearch from '../tour-search';
import TourFilters from '../tour-filters';
import TourFiltersResult from '../tour-filters-result';
import { axiosTest } from '@/utils/axios';
import { endpoints } from '@/api';
import { useAuthContext } from '@/auth/hooks';

// ----------------------------------------------------------------------

const defaultFilters = {
  destination: [],
  tourGuides: [],
  services: [],
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function TourListView() {
  const settings = useSettingsContext();

  const { user } = useAuthContext();

  const openFilters = useBoolean();

  const [sortBy, setSortBy] = useState('latest');

  const [search, setSearch] = useState({
    query: '',
    results: [],
  });

  const [filters, setFilters] = useState(defaultFilters);

  const dateError = isAfter(filters.startDate, filters.endDate);

  const [activities, setActivities] = useState([])
  // fetch activity data
  const token = sessionStorage.getItem('token')
  const httpConfig = {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  }
  const fetchAllActivities = async () => {
    const resp = await axiosTest.get(endpoints.activity.all, httpConfig)
    setActivities(resp.data.Data)
  }

  const dataFiltered = applyFilter({
    inputData: activities,
    filters,
    sortBy,
    dateError,
  });

  const canReset =
    !!filters.destination.length ||
    !!filters.tourGuides.length ||
    !!filters.services.length ||
    (!!filters.startDate && !!filters.endDate);

  const notFound = !dataFiltered.length && canReset;

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const handleSearch = useCallback(
    (inputValue) => {
      setSearch((prevState) => ({
        ...prevState,
        query: inputValue,
      }));

      if (inputValue) {
        const results = _tours.filter(
          (tour) => tour.name.toLowerCase().indexOf(search.query.toLowerCase()) !== -1
        );

        setSearch((prevState) => ({
          ...prevState,
          results,
        }));
      }
    },
    [search.query]
  );

  useEffect(() => {
    fetchAllActivities()
  }, [])

  const renderFilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <TourSearch
        query={search.query}
        results={search.results}
        onSearch={handleSearch}
        hrefItem={(id) => paths.home.tour.details(id)}
      />

      <Stack direction="row" spacing={1} flexShrink={0}>
        <TourFilters
          open={openFilters.value}
          onOpen={openFilters.onTrue}
          onClose={openFilters.onFalse}
          //
          filters={filters}
          onFilters={handleFilters}
          //
          canReset={canReset}
          onResetFilters={handleResetFilters}
          //
          serviceOptions={TOUR_SERVICE_OPTIONS.map((option) => option.label)}
          tourGuideOptions={_tourGuides}
          destinationOptions={countries.map((option) => option.label)}
          //
          dateError={dateError}
        />

        <TourSort sort={sortBy} onSort={handleSortBy} sortOptions={TOUR_SORT_OPTIONS} />
      </Stack>
    </Stack>
  );

  const renderResults = (
    <TourFiltersResult
      filters={filters}
      onResetFilters={handleResetFilters}
      //
      canReset={canReset}
      onFilters={handleFilters}
      //
      results={dataFiltered.length}
    />
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Home', href: paths.home.root },
          {
            name: 'Activity',
            href: paths.home.tour.root,
          },
          { name: 'List' },
        ]}
        action={
          user?.isOrganiser ? (
            <Button
              component={RouterLink}
              href={paths.home.tour.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              New Activity
            </Button>
          ) : null
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {renderFilters}

        {canReset && renderResults}
      </Stack>

      {notFound && <EmptyContent title="No Data" filled sx={{ py: 10 }} />}

      <TourList tours={dataFiltered} />
    </Container>
  );
}

// ----------------------------------------------------------------------

const applyFilter = ({ inputData, filters, sortBy, dateError }) => {
  const { services, destination, startDate, endDate, tourGuides } = filters;

  const tourGuideIds = tourGuides.map((tourGuide) => tourGuide.id);

  // SORT BY
  if (sortBy === 'latest') {
    inputData = orderBy(inputData, ['createdAt'], ['desc']);
  }

  if (sortBy === 'oldest') {
    inputData = orderBy(inputData, ['createdAt'], ['asc']);
  }

  if (sortBy === 'popular') {
    inputData = orderBy(inputData, ['totalViews'], ['desc']);
  }

  // FILTERS
  if (destination.length) {
    inputData = inputData.filter((tour) => destination.includes(tour.destination));
  }

  if (tourGuideIds.length) {
    inputData = inputData.filter((tour) =>
      tour.tourGuides.some((filterItem) => tourGuideIds.includes(filterItem.id))
    );
  }

  if (services.length) {
    inputData = inputData.filter((tour) => tour.services.some((item) => services.includes(item)));
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter((tour) =>
        isBetween(startDate, tour.available.startDate, tour.available.endDate)
      );
    }
  }

  return inputData;
};
