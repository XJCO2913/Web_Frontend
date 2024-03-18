import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import Image from 'src/components/image';
import { varFade, MotionContainer } from 'src/components/animate';
import Carousel, { useCarousel, CarouselDots, CarouselArrows } from 'src/components/carousel';
import {Fab,InputBase,Button} from '@mui/material'
import Iconify from 'src/components/iconify';
import ProfilePostItem from './app-profile-post-item';
// ----------------------------------------------------------------------

export default function AppFeatured({ list, ...other }) {
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
      <Card {...other}>
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
      {renderPostInput }
      <ProfilePostItem  post={{"id":"e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1","createdAt":"2024-03-17T04:09:26.232Z","media":"https://api-dev-minimal-v510.vercel.app/assets/images/travel/travel_2.jpg","message":"The sun slowly set over the horizon, painting the sky in vibrant hues of orange and pink.","personLikes":[{"name":"Jayvion Simon","avatarUrl":"https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_3.jpg"},{"name":"Lucian Obrien","avatarUrl":"https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_4.jpg"},{"name":"Deja Brady","avatarUrl":"https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_5.jpg"},{"name":"Harrison Stein","avatarUrl":"https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_6.jpg"},{"name":"Reece Chung","avatarUrl":"https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_7.jpg"},{"name":"Lainey Davidson","avatarUrl":"https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_8.jpg"},{"name":"Cristopher Cardenas","avatarUrl":"https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_9.jpg"},{"name":"Melanie Noble","avatarUrl":"https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_10.jpg"},{"name":"Chase Day","avatarUrl":"https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_11.jpg"},{"name":"Shawn Manning","avatarUrl":"https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_12.jpg"},{"name":"Soren Durham","avatarUrl":"https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_13.jpg"},{"name":"Cortez Herring","avatarUrl":"https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_14.jpg"},{"name":"Brycen Jimenez","avatarUrl":"https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_15.jpg"},{"name":"Giana Brandt","avatarUrl":"https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_16.jpg"},{"name":"Aspen Schmitt","avatarUrl":"https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_17.jpg"},{"name":"Colten Aguilar","avatarUrl":"https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_18.jpg"},{"name":"Angelique Morse","avatarUrl":"https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_19.jpg"},{"name":"Selina Boyer","avatarUrl":"https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_20.jpg"},{"name":"Lawson Bass","avatarUrl":"https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_21.jpg"},{"name":"Ariana Lang","avatarUrl":"https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_22.jpg"}],"comments":[{"id":"e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8","author":{"id":"e99f09a7-dd88-49d5-b1c8-1daf80c2d7b9","avatarUrl":"https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_6.jpg","name":"Lainey Davidson"},"createdAt":"2024-03-15T02:09:26.232Z","message":"Praesent venenatis metus at"},{"id":"e99f09a7-dd88-49d5-b1c8-1daf80c2d7b10","author":{"id":"e99f09a7-dd88-49d5-b1c8-1daf80c2d7b11","avatarUrl":"https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_7.jpg","name":"Cristopher Cardenas"},"createdAt":"2024-03-14T01:09:26.232Z","message":"Etiam rhoncus. Nullam vel sem. Pellentesque libero tortor, tincidunt et, tincidunt eget, semper nec, quam. Sed lectus."}]}} />
    </>
  );
}

AppFeatured.propTypes = {
  list: PropTypes.array,
};

// ----------------------------------------------------------------------

function CarouselItem({ item, active }) {
  const theme = useTheme();

  const { coverUrl, title, description } = item;

  const renderImg = (
    <Image
      alt={title}
      src={coverUrl}
      overlay={`linear-gradient(to bottom, ${alpha(theme.palette.grey[900], 0)} 0%, ${
        theme.palette.grey[900]
      } 75%)`}
      sx={{
        width: 1,
        height: {
          xs: 550,
          xl: 200,
        },
      }}
    />
  );

  return (
    <MotionContainer action animate={active} sx={{ position: 'relative' }}>
      <Stack
        spacing={1}
        sx={{
          p: 3,
          width: 1,
          bottom: 0,
          zIndex: 9,
          textAlign: 'left',
          position: 'absolute',
          color: 'common.white',
        }}
      >
        <m.div variants={varFade().inRight}>
          <Typography variant="overline" sx={{ color: 'primary.light' }}>
            Featured App
          </Typography>
        </m.div>

        <m.div variants={varFade().inRight}>
          <Link color="inherit" underline="none">
            <Typography variant="h5" noWrap>
              {title}
            </Typography>
          </Link>
        </m.div>

        <m.div variants={varFade().inRight}>
          <Typography variant="body2" noWrap>
            {description}
          </Typography>
        </m.div>
      </Stack>

      {renderImg}
    </MotionContainer>
  );
}

CarouselItem.propTypes = {
  active: PropTypes.bool,
  item: PropTypes.object,
};
const renderPostInput = (
  <Card sx={{ p: 3 }}>
    <InputBase
      multiline
      fullWidth
      rows={4}
      placeholder="Share what you are thinking here..."
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 1,
        border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.2)}`,
      }}
    />

    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
        <Fab size="small" color="inherit" variant="softExtended" onClick={()=>{}}>
          <Iconify icon="solar:gallery-wide-bold" width={24} sx={{ color: 'success.main' }} />
          Image/Video
        </Fab>

        <Fab size="small" color="inherit" variant="softExtended">
          <Iconify icon="solar:videocamera-record-bold" width={24} sx={{ color: 'error.main' }} />
          Streaming
        </Fab>
      </Stack>

      <Button variant="contained">Post</Button>
    </Stack>

    <input type="file" style={{ display: 'none' }} />
  </Card>
);
