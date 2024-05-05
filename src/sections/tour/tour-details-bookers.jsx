import PropTypes from 'prop-types';
import { useState, useCallback, useRef, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import Iconify from 'src/components/iconify';
import AMapPathDrawer from 'src/components/map'
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const _mockData = [
  [
    "103.97958670315778",
    "30.7643863752087"
  ],
  [
    "103.97960891707267",
    "30.764367099732258"
  ],
  [
    "103.97963177055475",
    "30.764337126943804"
  ],
  [
    "103.97965067362921",
    "30.764313325063334"
  ],
  [
    "103.97967263285031",
    "30.764287334107266"
  ],
  [
    "103.97969646810739",
    "30.764258453532552"
  ],
  [
    "103.97972319356286",
    "30.764226018275178"
  ],
  [
    "103.97975268584709",
    "30.764190530434803"
  ],
  [
    "103.9797848164426",
    "30.76415287955745"
  ],
  [
    "103.97981629980565",
    "30.764113156772353"
  ],
  [
    "103.97984375364496",
    "30.764074458945885"
  ],
  [
    "103.97987314959785",
    "30.764036629208817"
  ],
  [
    "103.9799027933042",
    "30.763997441724964"
  ],
  [
    "103.9799313043599",
    "30.76395665309048"
  ],
  [
    "103.97996005544633",
    "30.763916338646855"
  ],
  [
    "103.97999011312483",
    "30.763877362845527"
  ],
  [
    "103.98001998877572",
    "30.76383856285594"
  ],
  [
    "103.98004995390843",
    "30.763797708939098"
  ],
  [
    "103.98008137268208",
    "30.76375701538967"
  ],
  [
    "103.980112507727",
    "30.76371661387649"
  ],
  [
    "103.98014259878056",
    "30.763676049671194"
  ],
  [
    "103.98017322386085",
    "30.763633836531927"
  ],
  [
    "103.98020524933264",
    "30.76359194715243"
  ],
  [
    "103.98023686837608",
    "30.763549423956782"
  ],
  [
    "103.98026929955559",
    "30.76350480057869"
  ],
  [
    "103.98029788932273",
    "30.763458941838646"
  ],
  [
    "103.98032594288827",
    "30.763412580098297"
  ],
  [
    "103.9803602757707",
    "30.76337257786067"
  ],
  [
    "103.98039268600773",
    "30.763332816946065"
  ],
  [
    "103.98042541726134",
    "30.763291944023216"
  ],
  [
    "103.98045862726299",
    "30.763250751037962"
  ],
  [
    "103.98049029174183",
    "30.76321095521602"
  ],
  [
    "103.98051937733663",
    "30.763169233027078"
  ],
  [
    "103.9805489036616",
    "30.7631274097495"
  ],
  [
    "103.98057957993787",
    "30.76308712509059"
  ],
  [
    "103.98061048947133",
    "30.763046840639866"
  ],
  [
    "103.9806406043486",
    "30.763008932480428"
  ],
  [
    "103.98067023400836",
    "30.762970609558895"
  ],
  [
    "103.98069969818441",
    "30.76293332096511"
  ],
  [
    "103.98073017573604",
    "30.762896582701078"
  ],
  [
    "103.98076032683875",
    "30.762859983540814"
  ],
  [
    "103.98078859328923",
    "30.762822375089335"
  ],
  [
    "103.98081544291817",
    "30.762785234485445"
  ],
  [
    "103.98084219360277",
    "30.76274796094956"
  ],
  [
    "103.98087009613802",
    "30.762709674362423"
  ],
  [
    "103.98089839318392",
    "30.762672905808177"
  ],
  [
    "103.98092608350022",
    "30.762638289537556"
  ],
  [
    "103.9809563960881",
    "30.762602276713427"
  ],
  [
    "103.98098802318634",
    "30.762566435855582"
  ],
  [
    "103.98101823722537",
    "30.762532046006037"
  ],
  [
    "103.98117452217024",
    "30.76233414487496"
  ],
  [
    "103.98144158319623",
    "30.761989752156722"
  ],
  [
    "103.98154445921467",
    "30.76185588637599"
  ],
  [
    "103.9816094192061",
    "30.761771347347956"
  ],
  [
    "103.98164428072222",
    "30.76172288851731"
  ],
  [
    "103.98167654345592",
    "30.76168082148454"
  ]
]

function convertDataToPaths(data, color) {
  const coords = data.map(point =>
    point.map(str => {
      const num = parseFloat(str);
      if (isNaN(num)) {
        throw new Error("Invalid coordinate data");
      }
      return num;
    })
  );
  
  return [{ coords, color }];
}

// ----------------------------------------------------------------------

export default function TourDetailsBookers({ bookers, media_gpx }) {
  const [approved, setApproved] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    if (media_gpx) {
      setCurrentPath(media_gpx);
    }
  }, [media_gpx]);

  console.log(typeof currentPath.coords)

  const handlePathChange = (newPath) => {
    setCurrentPath(current => [
      ...current,
      convertDataToPaths(newPath, '#FF0000')  // 假设你想使用红色作为新路径的颜色
    ]);
  };

  const handleClick = useCallback(
    (item) => {
      const selected = approved.includes(item)
        ? approved.filter((value) => value !== item)
        : [...approved, item];

      setApproved(selected);
    },
    [approved]
  );

  console.log(currentPath)

  return (
    <>
      {currentPath && (
        <Stack mb={3} spacing={1} mt={-2}>
          <Typography variant="h6">Route View</Typography>
          <Box
            rowGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
            }}
            sx={{ mb: -2 }}
          >
            <AMapPathDrawer
              paths={[{
                coords: currentPath,
                color: '#00A76F'
              }]}
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Box>
        </Stack>
      )}

      <Divider sx={{ borderStyle: 'dashed', mb: 2, mt: 4 }} />

      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {bookers.map((booker) => (
          <BookerItem
            key={booker.userID}
            booker={booker}
            selected={approved.includes(booker.userID)}
            onSelected={() => handleClick(booker.userID)}
            user={user}
            onChangePath={() => handlePathChange(_mockData)}
          />
        ))}
      </Box>
    </>

  );
}

TourDetailsBookers.propTypes = {
  bookers: PropTypes.array,
  media_gpx: PropTypes.object,
};

// ----------------------------------------------------------------------

function BookerItem({ booker, selected, user, onChangePath }) {
  const fileRef = useRef(null);

  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  return (
    <Stack component={Card} direction="row" spacing={2} key={booker.userID} sx={{ p: 3 }}>
      <Avatar alt={booker.username} src={booker.avatarURL} sx={{ width: 48, height: 48 }} />

      <input
        type="file"
        style={{ display: 'none' }}
        ref={fileRef}
      />

      <Stack spacing={2} flexGrow={1}>
        <ListItemText
          primary={booker.username}
          secondary={
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Iconify icon="solar:buildings-2-bold-duotone" width={16} />
              {booker.region}
            </Stack>
          }
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
            color: 'text.disabled',
          }}
        />

        {user.username === booker.username && (
          <Stack spacing={1} direction="row" sx={{ mb: -1 }}>
            <Button
              size="small"
              variant={selected ? 'text' : 'outlined'}
              onClick={handleAttach}
            >
              upload
            </Button>
            <Button
              size="small"
              variant={selected ? 'text' : 'outlined'}
            >
              start now
            </Button>
          </Stack>
        )}
      </Stack>

      <Button
        size="small"
        variant={selected ? 'text' : 'outlined'}
        onClick={onChangePath}
      >
        {selected ? 'hide' : 'show'}
      </Button>
    </Stack>
  );
}

BookerItem.propTypes = {
  booker: PropTypes.object,
  onSelected: PropTypes.func,
  selected: PropTypes.bool,
  user: PropTypes.object,
  onChangePath: PropTypes.func,
};
