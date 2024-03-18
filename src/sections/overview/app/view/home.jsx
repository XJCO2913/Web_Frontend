// import Stack from '@mui/material/Stack';
// import { useTheme } from '@mui/material/styles';
// import Container from '@mui/material/Container';
// import Grid from '@mui/material/Unstable_Grid2';

// import { useMockedUser } from 'src/hooks/use-mocked-user';
// import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';
// import { useSettingsContext } from 'src/components/settings';

// import AppFeatured from '../app-featured';


// // ----------------------------------------------------------------------

// export default function OverviewAppView() {
//   const { user } = useMockedUser();

//   const theme = useTheme();

//   const settings = useSettingsContext();

//   return (
//     <Container maxWidth={settings.themeStretch ? false : 'xl'}>
//       <Grid container spacing={3}>
//         <Grid xs={12} md={12}>
//           <AppFeatured list={_appFeatured} />
//         </Grid>
//       </Grid>
//     </Container>
//   );
// }

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';

import { useMockedUser } from 'src/hooks/use-mocked-user';
import { useSettingsContext } from 'src/components/settings';
import AppFeatured from '../app-featured';
import { _appFeatured } from 'src/_mock'; // 确保你已经有了这个数据或相应的导入

export default function OverviewAppView() {
  const { user } = useMockedUser();
  const theme = useTheme();
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ mt: -2.5}}> {/* 这里添加 marginTop */}
      <Grid container spacing={3}>
        <Grid xs={12} md={12}>
          <AppFeatured list={_appFeatured} />
        </Grid>
      </Grid>
    </Container>
  );
}

