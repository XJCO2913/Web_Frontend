import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { m, AnimatePresence } from 'framer-motion';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import { InputBase } from '@mui/material'
import Snackbar from '@mui/material/Snackbar';
import AlertTitle from '@mui/material/AlertTitle'
import Alert from '@mui/material/Alert';

import { useSettingsContext } from 'src/components/settings';
import Carousel, { useCarousel, CarouselDots, CarouselArrows } from 'src/components/carousel';
import FormProvider, { RHFUploadOverride } from 'src/components/hook-form';
import axiosInstance, { axiosTest } from 'src/utils/axios';
import { endpoints } from 'src/api/index'

import Moment from '../home-moment';
import CarouselItem from '../home-carousel'
import { useWebSocketManager } from '@/websocket/context/websocket_provider';
import { WebSocketManager } from '@/websocket/context/websocket_manager';

// ----------------------------------------------------------------------

// 获取朋友圈
const fetchMoments = async (setMoments, setNextTime, nextTime, hasMore, setHasMore) => {
  if (!hasMore) return;

  const time = nextTime || new Date().getTime();
  try {
    const response = await axiosTest.get(`${endpoints.moment.fetch}?latestTime=${time}`);
    if (response.data.Data.nextTime) {
      setMoments(prevMoments => [...prevMoments, ...response.data.Data.moments]);
      setNextTime(response.data.Data.nextTime);
      if (response.data.Data.moments.length === 0) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
      console.log("No more moments to load");
    }
  } catch (error) {
    console.error('Fetching moments failed:', error);
  }
};

// 获取首页活动
const fetchActivities = async (setActivities) => {
  try {
    const response = await axiosInstance.get(endpoints.activity.fetch);
    const activitiesData = response.data.Data.Activities.map((activity) => ({
      id: activity.ActivityID,
      title: activity.Name,
      description: activity.Description,
      coverUrl: activity.CoverUrl,
    }));
    setActivities(activitiesData);
  } catch (error) {
    console.error('Fetching activities failed:', error.response || error);
  }
};

// ----------------------------------------------------------------------

const MOCK_ACTIVITY = [
  {
    id: '8f12781c-f4e5-11ee-877a-0242ac150006',
    title: 'Cycling',
    description: `Let's go cycling together on the Tianfu Greenway in Chengdu.`,
    coverUrl: '/c1.jpg',
  },
  {
    id: 'aff0902e-f4e4-11ee-877a-0242ac150006',
    title: 'Marathon',
    description: 'Marathon',
    coverUrl: '/c2.jpg',
  }
]

export default function HomeView() {
  const { wsManager, setWsManager } = useWebSocketManager()

  const [snackbarInfo, setSnackbarInfo] = useState({
    open: false,
    message: '',
    type: 'success',
  });

  const [success, setSuccess] = useState(false);
  const [content, setContent] = useState('');
  const settings = useSettingsContext();
  const [moments, setMoments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [nextTime, setNextTime] = useState();
  const [shouldLoad, setShouldLoad] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchMoments(setMoments, setNextTime, nextTime, hasMore, setHasMore);
    fetchActivities(setActivities);

    if (wsManager === null) {
      const ws = new WebSocketManager('ws://43.136.232.116:5000/ws')

      setWsManager(ws)
      ws.connect()
    }
  }, []);

  useEffect(() => {
    if (shouldLoad && hasMore) {
      const fetchInitialMoments = async () => {
        await fetchMoments(setMoments, setNextTime, nextTime, hasMore, setHasMore);
        setShouldLoad(false); // 重置加载标志
      };
      fetchInitialMoments();
    }

    // 防抖函数
    const debounce = (func, wait) => {
      let timeout;
      return function executedFunction() {
        const later = () => {
          clearTimeout(timeout);
          func();
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    };

    // 使用防抖函数来减少频繁调用
    const debouncedHandleScroll = debounce(handleScroll, 100);

    window.addEventListener('scroll', debouncedHandleScroll);
    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  }, [shouldLoad, nextTime, moments.length]);

  // 在滚动事件处理函数中设置shouldLoad
  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop + 50 >= document.documentElement.offsetHeight) {
      setShouldLoad(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarInfo(prev => ({ ...prev, open: false }));
  };

  // validate the form
  const PostSchema = Yup.object().shape({
    content: Yup.string(),
  });

  const defaultValues = {
    content: '',
    file: [],
  };

  const methods = useForm({
    resolver: yupResolver(PostSchema),
    defaultValues
  });

  const {
    watch,
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      formData.append('content', data.content);

      const file = data.file[0];

      if (file) {
        let fieldName = '';
        if (file.type.match('image.*')) {
          fieldName = 'imageFile';
        } else if (file.type === 'text/xml') {
          fieldName = 'gpxFile';
        } else if (file.type.match('video.*')) {
          fieldName = 'videoFile';
        }
        if (fieldName) {
          formData.append(fieldName, file);
        } else {
          throw new Error('Invalid file format!');
        }
      }

      const response = await axiosInstance.post(endpoints.moment.create, formData);
      if (response.data.status_code === 0) {
        setSuccess(true)
        reset({ content: '', file: [] });
        setSnackbarInfo({ open: true, message: 'Post successfully created!', type: 'success' });
      } else {
        setSuccess(false)
        setSnackbarInfo({ open: true, message: 'Post failed to create!', type: 'error' });
      }
    } catch (error) {
      console.error(error);
      setSnackbarInfo({ open: true, message: error.message || 'An unexpected error occurred', type: 'error' });
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const newImageFiles = acceptedFiles.filter(file => file.type.match('image.*'));
      const newVideoFiles = acceptedFiles.filter(file => file.type.match('video.*'));
      const newXmlFiles = acceptedFiles.filter(file => file.type === 'application/xml' || file.type === 'text/xml');

      // 获取已上传文件的类型
      const existingTypes = values.file ? values.file.map(file => file.type) : [];
      const hasExistingImage = existingTypes.some(type => type.match('image.*'));
      const hasExistingVideo = existingTypes.some(type => type.match('video.*'));
      const hasExistingXml = existingTypes.some(type => type === 'application/xml' || type === 'text/xml');

      // 规则检验：
      // 1. 不允许同时上传视频、图片和XML。
      // 2. 视频和XML文件都只能上传一个。
      // 3. 分次上传不同类型的文件也不被允许。
      const isInvalidCombination = (
        (newVideoFiles.length > 0 && (newImageFiles.length > 0 || newXmlFiles.length > 0 || hasExistingImage || hasExistingXml)) ||
        (newXmlFiles.length > 0 && (newImageFiles.length > 0 || newVideoFiles.length > 0 || hasExistingImage || hasExistingVideo)) ||
        (newImageFiles.length > 0 && (hasExistingVideo || hasExistingXml)) ||
        newVideoFiles.length > 1 || newXmlFiles.length > 1 ||
        (newVideoFiles.length > 0 && hasExistingVideo) ||
        (newXmlFiles.length > 0 && hasExistingXml)
      );

      if (isInvalidCombination) {
        setSnackbarInfo({
          open: true,
          message: 'Uploading diffreent types of files together is not allowed. Only one type of file can be uploaded.',
          type: 'error',
        });
        return;
      }

      const newFiles = acceptedFiles.map(file =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setSuccess(false)
      setValue('file', [...(values.file || []), ...newFiles], { shouldValidate: true });
    },
    [setValue, values.file, setSnackbarInfo]
  );

  const handleRemoveFile = useCallback(
    (inputFile) => {
      setSuccess(false);
      const filtered = values.file && values.file?.filter((file) => file !== inputFile);
      setValue('file', filtered);
    },
    [setValue, values.file, setSuccess]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setSuccess(false);
    setValue('file', []);
  }, [setValue, setSuccess]);

  const handleContentChange = (e) => {
    setSuccess(false);
    // Assuming you are controlling content via React Hook Form
    setContent(e.target.value);
    setValue('content', e.target.value);
  };

  const renderPostInput = (
    <AnimatePresence>
      <Card sx={{ p: 3, mt: 2 }}
        component={m.div}
        transition={0.8}
      >
        <InputBase
          name='content'
          multiline
          fullWidth
          rows={4}
          placeholder="Share what you are thinking here..."
          value={values.content}
          onChange={handleContentChange}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 1,
            border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.2)}`,
          }}
        />
        <Stack spacing={1.5}
        >
          <RHFUploadOverride
            multiple
            thumbnail
            name="file"
            maxSize={3145728}
            onDrop={handleDrop}
            onRemove={handleRemoveFile}
            onRemoveAll={handleRemoveAllFiles}
            onPost={onSubmit}
            onContent={content}
            isSuccess={success}
            loading={isSubmitting}
          />
        </Stack>
      </Card>
    </AnimatePresence >
  );

  const carousel = useCarousel({
    speed: 800,
    autoplay: true,
    ...CarouselDots({
      sx: {
        top: 10,
        left: 16,
        position: 'absolute',
        color: 'primary.light',
      },
    }),
  });

  return (
    <>
      <Snackbar
        open={snackbarInfo.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={snackbarInfo.type} sx={{ width: '100%' }}>
          <AlertTitle>{snackbarInfo.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
          {snackbarInfo.message}
        </Alert>
      </Snackbar>

      <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ mt: -2.5 }}>
        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <Card>
              <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
                {MOCK_ACTIVITY.map((activity, index) => (
                  <CarouselItem key={activity.id} item={activity} active={index === carousel.currentIndex} />
                ))}
              </Carousel>

              <CarouselArrows
                onNext={carousel.onNext}
                onPrev={carousel.onPrev}
                sx={{ top: 8, right: 8, position: 'absolute', color: 'common.white' }}
              />
            </Card>

            <FormProvider methods={methods} onSubmit={onSubmit}>
              {renderPostInput}
            </FormProvider>

            {moments.map((post, index) => (
              <Moment key={index} post={post} />
            ))}
          </Grid>
        </Grid>
      </Container >
    </>
  );
}