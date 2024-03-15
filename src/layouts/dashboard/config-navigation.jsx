import { useMemo } from 'react';
import { paths } from 'src/routes/paths';
import { useTranslate } from 'src/locales';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  home: icon('ic_blog'), // Assuming there is an 'ic_home.svg' for the home icon
  user: icon('ic_user'),
  chat: icon('ic_chat'),
  tour: icon('ic_tour'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useTranslate();

  const data = useMemo(() => [
    {
      subheader: t('main'),
      items: [
        {
          title: t('home'), // Renamed 'app' to 'home'
          path: paths.dashboard.root, // Assuming this is the path for home
          icon: ICONS.home,
        },
        {
          title: t('user'),
          path: paths.dashboard.user.root,
          icon: ICONS.user,
          children: [
            { title: t('profile'), path: paths.dashboard.user.root },
            { title: t('cards'), path: paths.dashboard.user.cards },
            { title: t('list'), path: paths.dashboard.user.list },
            { title: t('create'), path: paths.dashboard.user.new },
            { title: t('edit'), path: paths.dashboard.user.demo.edit },
            { title: t('account'), path: paths.dashboard.user.account },
          ],
        },
        {
          title: t('chat'),
          path: paths.dashboard.chat,
          icon: ICONS.chat,
        },
        {
          title: t('tour'),
          path: paths.dashboard.tour.root,
          icon: ICONS.tour,
          children: [
            { title: t('list'), path: paths.dashboard.tour.root },
            { title: t('details'), path: paths.dashboard.tour.demo.details },
            { title: t('create'), path: paths.dashboard.tour.new },
            { title: t('edit'), path: paths.dashboard.tour.demo.edit },
          ],
        },
      ],
    },
  ], [t]);

  return data;
}
