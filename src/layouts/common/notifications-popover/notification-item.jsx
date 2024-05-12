import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import Button from '@mui/material/Button';

import AMapPathDrawer from 'src/components/map'
import { wgs2gcj } from 'src/utils/xml-shift'

// ----------------------------------------------------------------------

export default function NotificationItem({ notification }) {

  const convertArrayToXml = (route) => {
    let xmlString = '<?xml version="1.0" encoding="UTF-8"?>\n<route>\n';
    route.forEach((point, index) => {
      xmlString += `  <point id="${index}">\n`;
      xmlString += `    <latitude>${point[0]}</latitude>\n`;
      xmlString += `    <longitude>${point[1]}</longitude>\n`;
      xmlString += '  </point>\n';
    });
    xmlString += '</route>';
    return xmlString;
  };

  const handleDownloadXml = (route) => {
    const xmlData = convertArrayToXml(route);
    const blob = new Blob([xmlData], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'route.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // 清理创建的URL，防止内存泄漏
  };

  const renderAvatar = (
    <ListItemAvatar>
      {notification.avatarUrl ? (
        <Avatar src={notification.avatarUrl} sx={{ bgcolor: 'background.neutral' }} />
      ) : (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: 'background.neutral',
          }}
        >
        </Stack>
      )}
    </ListItemAvatar>
  );

  const renderText = (
    <ListItemText
      disableTypography
      primary={reader(notification.title)}
      secondary={
        <Stack
          direction="row"
          alignItems="center"
          sx={{ typography: 'caption', color: 'text.disabled' }}
          divider={
            <Box
              sx={{
                width: 2,
                height: 2,
                bgcolor: 'currentColor',
                mx: 0.5,
                borderRadius: '50%',
              }}
            />
          }
        >
          {notification.createdAt}
        </Stack>
      }
    />
  );

  const routeAction = (
    notification.type === 'route' ?
      <>
        <Stack spacing={1} direction="row" sx={{ mt: 1.5 }}>
          <AMapPathDrawer
            paths={[{
              coords: notification?.route,
              color: '#00A76F'
            }]}
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Stack>
        <Button onClick={() => handleDownloadXml(notification?.route)} variant="contained" color="primary" sx={{mt: 1.5}}>
          Download XML
        </Button>
      </>
      :
      <></>
  );


  return (
    <ListItemButton
      disableRipple
      sx={{
        p: 2.5,
        alignItems: 'flex-start',
        borderBottom: (theme) => `dashed 1px ${theme.palette.divider}`,
      }}
    >
      {renderAvatar}
      <Stack sx={{ flexGrow: 1 }}>
        {renderText}
        {routeAction}
      </Stack>
    </ListItemButton>
  );
}

NotificationItem.propTypes = {
  notification: PropTypes.object,
};

// ----------------------------------------------------------------------

function reader(data) {
  return (
    <Box
      dangerouslySetInnerHTML={{ __html: data }}
      sx={{
        mb: 0.5,
        '& p': { typography: 'body2', m: 0 },
        '& a': { color: 'inherit', textDecoration: 'none' },
        '& strong': { typography: 'subtitle2' },
      }}
    />
  );
}
