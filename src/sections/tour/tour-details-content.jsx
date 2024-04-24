import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fDate } from 'src/utils/format-time';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import { varTranHover } from 'src/components/animate';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import AMapPathDrawer from 'src/components/map'

// ----------------------------------------------------------------------

const ACTIVITY_TAGS = [
  { tagID: '10001', tagName: 'Refresher' },
  { tagID: '10002', tagName: 'Supplement' },
  { tagID: '10003', tagName: 'Sports-outfit' },
  { tagID: '10004', tagName: 'Medical-support' },
]

export default function TourDetailsContent({ tour }) {
  const {
    name,
    coverUrl,
    description,
    startDate,
    endDate,
    numberLimit,
    creatorName,
    media_gpx,
  } = tour;

  const [tagArr, setTagArr] = useState([])

  const slides = [
    { src: coverUrl }
  ]

  const {
    selected: selectedImage,
    open: openLightbox,
    onOpen: handleOpenLightbox,
    onClose: handleCloseLightbox,
  } = useLightBox(slides);

  function getTagName(tagID) {
    const tag = ACTIVITY_TAGS.find(tag => tag.tagID === tagID);
    return tag ? tag.tagName : null;
  }

  useEffect(() => {
    if (tour && tour.tags) {
      setTagArr(tour.tags.split('|'))
    }
  }, [tour])

  const renderGallery = (
    <>
      <Box
        gap={1}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(1, 1fr)',
        }}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <m.div
          key={slides[0].src}
          whileHover="hover"
          variants={{
            hover: { opacity: 0.8 },
          }}
          transition={varTranHover()}
        >
          <Image
            alt={slides[0].src}
            src={slides[0].src}
            ratio="1/1"
            onClick={() => handleOpenLightbox(slides[0].src)}
            sx={{ borderRadius: 2, cursor: 'pointer' }}
          />
        </m.div>

        <Box gap={1} display="grid" gridTemplateColumns="repeat(2, 1fr)">
          {slides.slice(1, 1).map((slide) => (
            <m.div
              key={slide.src}
              whileHover="hover"
              variants={{
                hover: { opacity: 0.8 },
              }}
              transition={varTranHover()}
            >
              <Image
                alt={slide.src}
                src={slide.src}
                ratio="1/1"
                onClick={() => handleOpenLightbox(slide.src)}
                sx={{ borderRadius: 2, cursor: 'pointer' }}
              />
            </m.div>
          ))}
        </Box>
      </Box>

      <Lightbox
        index={selectedImage}
        slides={slides}
        open={openLightbox}
        close={handleCloseLightbox}
      />
    </>
  );

  const renderHead = (
    <>
      <Stack direction="row" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {name}
        </Typography>

        <IconButton>
          <Iconify icon="solar:share-bold" />
        </IconButton>

        <Checkbox
          defaultChecked
          color="error"
          icon={<Iconify icon="solar:heart-outline" />}
          checkedIcon={<Iconify icon="solar:heart-bold" />}
        />
      </Stack>

      <Stack spacing={3} direction="row" flexWrap="wrap" alignItems="center">
        {/* <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'body2' }}>
          <Iconify icon="eva:star-fill" sx={{ color: 'warning.main' }} />
          <Box component="span" sx={{ typography: 'subtitle2' }}>
            {ratingNumber}
          </Box>
          <Link sx={{ color: 'text.secondary' }}>(234 reviews)</Link>
        </Stack> */}

        {/* <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'body2' }}>
          <Iconify icon="mingcute:location-fill" sx={{ color: 'error.main' }} />
          {destination}
        </Stack> */}

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'subtitle2' }}>
          <Iconify icon="solar:flag-bold" sx={{ color: 'info.main' }} />
          <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
            Created by
          </Box>
          {creatorName}
        </Stack>
      </Stack>
    </>
  );

  const renderOverview = (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        md: 'repeat(2, 1fr)',
      }}
    >
      {[
        {
          label: 'Available',
          value: `${fDate(startDate)} - ${fDate(endDate)}`,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Contact name',
          value: creatorName,
          icon: <Iconify icon="solar:user-rounded-bold" />,
        },
        {
          label: 'Participants limit',
          value: numberLimit,
          icon: <Iconify icon="solar:people-nearby-bold" />,
        },
        {
          label: 'Contact phone',
          value: '+86 18950785805',
          icon: <Iconify icon="solar:phone-bold" />,
        },
      ].map((item) => (
        <Stack key={item.label} spacing={1.5} direction="row">
          {item.icon}
          <ListItemText
            primary={item.label}
            secondary={item.value}
            primaryTypographyProps={{
              typography: 'body2',
              color: 'text.secondary',
              mb: 0.5,
            }}
            secondaryTypographyProps={{
              typography: 'subtitle2',
              color: 'text.primary',
              component: 'span',
            }}
          />
        </Stack>
      ))}
    </Box>
  );

  const renderContent = (
    <>
      <Typography variant="h6" sx={{mb:2}}> Description</Typography>
      <Markdown children={description} />

      <Divider sx={{ borderStyle: 'dashed', mb:-6, mt:2 }} />

      <Stack spacing={2} mt={8}>
        <Typography variant="h6"> Services</Typography>

        <Box
          rowGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
        >
          {ACTIVITY_TAGS.map((tag) => (
            <Stack
              key={tag.tagID}
              spacing={1}
              direction="row"
              alignItems="center"
              sx={{
                ...(!tagArr.includes(tag.tagID) && {
                  color: 'text.disabled',
                }),
              }}
            >
              <Iconify
                icon="eva:checkmark-circle-2-outline"
                sx={{
                  color: 'primary.main',
                  ...(!tagArr.includes(tag.tagID) && {
                    color: 'text.disabled',
                  }),
                }}
              />
              {getTagName(tag.tagID)}
            </Stack>
          ))}
        </Box>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed', mb:-6, mt:2 }} />

      <Stack spacing={2} mt={8}>
        <Typography variant="h6"> Route View</Typography>

        <Box
          rowGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
          sx={{mb:-5}}
        >
          <AMapPathDrawer path={media_gpx} style={{ width: '100%', borderRadius: '8px' }} />
        </Box>
      </Stack>
    </>
  );

  return (
    <>
      {renderGallery}

      <Stack sx={{ maxWidth: 720, mx: 'auto' }}>
        {renderHead}

        <Divider sx={{ borderStyle: 'dashed', my: 2 }} />

        {renderOverview}

        <Divider sx={{ borderStyle: 'dashed', my: 2 }} />

        {renderContent}
      </Stack>
    </>
  );
}

TourDetailsContent.propTypes = {
  tour: PropTypes.object,
};
