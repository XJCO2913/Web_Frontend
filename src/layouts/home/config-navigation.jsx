import { useMemo } from 'react';
import { paths } from 'src/routes/paths';
import { useTranslate } from 'src/locales';
import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  home: icon('ic_label'),
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
          title: t('home'),
          path: paths.home.root,
          icon: ICONS.home,
        },
        {
          title: t('user'),
          path: paths.home.user.root,
          icon: ICONS.user,
          children: [
            { title: t('profile'), path: paths.home.user.root },
            { title: t('list'), path: paths.home.user.list },
            { title: t('account'), path: paths.home.user.account },
          ],
        },
        {
          title: t('chat'),
          path: paths.home.chat,
          icon: ICONS.chat,
        },
        {
          title: t('activity'),
          path: paths.home.tour.root,
          icon: ICONS.tour,
        },
      ],
    },
  ], [t]);

  return data;
}
