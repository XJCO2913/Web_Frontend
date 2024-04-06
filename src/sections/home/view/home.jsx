import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import { InputBase } from '@mui/material'
import Snackbar from '@mui/material/Snackbar';
import AlertTitle from '@mui/material/AlertTitle'
import Alert from '@mui/material/Alert';

import { _appFeatured } from 'src/_mock';
import { useSettingsContext } from 'src/components/settings';
import Carousel, { useCarousel, CarouselDots, CarouselArrows } from 'src/components/carousel';
import FormProvider, { RHFUploadOverride } from 'src/components/hook-form';
import {axiosTest} from 'src/utils/axios';
import { endpoints } from 'src/api/index'

import MomentPost from '../home-moment-post';
import CarouselItem from '../home-carousel'


// ----------------------------------------------------------------------

export default function HomeView() {

  const [errorWarning, seterrorWarning] = useState(false);
  const [content, setContent] = useState('');
  const settings = useSettingsContext();
  const list = _appFeatured;

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    seterrorWarning(false);
  };

  // validate the form
  const PostSchema = Yup.object().shape({
    content: Yup.string(),
    images: Yup.array().min(1, 'Images is required'),
  });

  const defaultValues = {
    content: '',
    imageFile: [],
    videoFile: [],
    gpxFile: []
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
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const formData = new FormData();
      formData.append('content', data.content);
      if (data.imageFile && data.imageFile[0]) {
        formData.append('imageFile', data.imageFile[0]);
      }
      console.log(data.imageFile[0], data.videoFile, data.gpxFile)
      const response = await axiosTest.post(endpoints.moment.create, formData);
      console.log(response)
      reset();
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const files = values.imageFile || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('imageFile', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.imageFile]
  );

  const handleRemoveFile = useCallback(
    (inputFile) => {
      const filtered = values.imageFile && values.imageFile?.filter((file) => file !== inputFile);
      setValue('imageFile', filtered);
    },
    [setValue, values.imageFile]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('imageFile', []);
  }, [setValue]);

  const renderPostInput = (
    <Card sx={{ p: 3 }}>
      <InputBase
        name='content'
        multiline
        fullWidth
        rows={4}
        placeholder="Share what you are thinking here..."
        onChange={(e) => {
          setContent(e.target.value);
          setValue('content', e.target.value); // 确保也更新了 react-hook-form 的值
        }}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 1,
          border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.2)}`,
        }}
      />

      <Stack spacing={1.5}>
        <RHFUploadOverride
          multiple
          thumbnail
          name="imageFile"
          maxSize={3145728}
          onDrop={handleDrop}
          onRemove={handleRemoveFile}
          onRemoveAll={handleRemoveAllFiles}
          onPost={onSubmit}
          onContent={content}
        />
      </Stack>
    </Card>
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
        open={errorWarning}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          <AlertTitle>Error</AlertTitle>
          File format error!
        </Alert>
      </Snackbar>
      <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ mt: -2.5 }}>
        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <Card>
              <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
                {list.map((app, index) => (
                  <CarouselItem key={app.id} item={app} active={index === carousel.currentIndex} />
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

            <MomentPost post={{
              "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1",
              "createdAt": "2024-03-17T04:09:26.232Z",
              "media": "https://api-dev-minimal-v510.vercel.app/assets/images/travel/travel_2.jpg",
              "message": "The sun slowly set over the horizon, painting the sky in vibrant hues of orange and pink.",
              "personLikes":
                [{ "name": "Jayvion Simon", "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_3.jpg" },
                { "name": "Lucian Obrien", "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_4.jpg" },
                { "name": "Deja Brady", "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_5.jpg" },
                { "name": "Harrison Stein", "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_6.jpg" },
                { "name": "Reece Chung", "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_7.jpg" },
                { "name": "Lainey Davidson", "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_8.jpg" },
                { "name": "Cristopher Cardenas", "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_9.jpg" },
                { "name": "Melanie Noble", "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_10.jpg" },
                { "name": "Chase Day", "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_11.jpg" },
                { "name": "Shawn Manning", "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_12.jpg" },
                { "name": "Soren Durham", "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_13.jpg" },
                { "name": "Cortez Herring", "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_14.jpg" },
                { "name": "Brycen Jimenez", "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_15.jpg" },
                { "name": "Giana Brandt", "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_16.jpg" },
                { "name": "Aspen Schmitt", "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_17.jpg" },
                { "name": "Colten Aguilar", "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_18.jpg" },
                { "name": "Angelique Morse", "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_19.jpg" },
                { "name": "Selina Boyer", "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_20.jpg" },
                { "name": "Lawson Bass", "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_21.jpg" },
                { "name": "Ariana Lang", "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_22.jpg" }],

              "comments":
                [{
                  "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8",
                  "author":
                  {
                    "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b9",
                    "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_6.jpg",
                    "name": "Lainey Davidson"
                  },
                  "createdAt": "2024-03-15T02:09:26.232Z",
                  "message": "Praesent venenatis metus at"
                },

                {
                  "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b10",
                  "author":
                  {
                    "id": "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b11",
                    "avatarUrl": "https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_7.jpg",
                    "name": "Cristopher Cardenas"
                  },
                  "createdAt": "2024-03-14T01:09:26.232Z",
                  "message": "Etiam rhoncus. Nullam vel sem. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Sed lectus."
                }]
            }} />
          </Grid>
        </Grid>
      </Container >
    </>
  );
}

