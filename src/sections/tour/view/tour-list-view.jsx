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
  const fetchAllActivities = async () => {
    const resp = await axiosTest.get(endpoints.activity.all)
    setActivities(resp.data.Data)
  }

  const dataFiltered = applyFilter({
    inputData: activities,
    filters,
    sortBy,
    dateError,
  });

  const canReset = (!!filters.startDate && !!filters.endDate);  // Update based on actual used filters

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);  // Ensure defaultFilters reflect the actual filters you're using
  }, []);

  const handleSortBy = useCallback((newValue) => {
    setSortBy(newValue);
  }, []);

  const notFound = !dataFiltered.length && canReset;

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

const applyFilter = ({ inputData, sortBy, dateError, startDate, endDate }) => {
  // 根据sortBy参数排序
  switch (sortBy) {
    case 'latest':
      inputData = orderBy(inputData, activity => new Date(activity.startDate), ['desc']); // 日期从新到旧排序
      break;
    case 'oldest':
      inputData = orderBy(inputData, activity => new Date(activity.startDate), ['asc']); // 日期从旧到新排序
      break;
    case 'popular':
      inputData = orderBy(inputData, ['participantsCount'], ['desc']); // 按参与者数量降序排序
      break;
    default:
      // 如果没有指定排序，默认可能按照一定逻辑处理或不处理
      break;
  }

  // 如果指定了日期范围，过滤日期
  if (!dateError && startDate && endDate) {
    inputData = inputData.filter((activity) =>
      new Date(activity.startDate) >= new Date(startDate) && new Date(activity.startDate) <= new Date(endDate)
    );
  }

  return inputData;
};