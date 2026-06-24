import { useEffect, type FC } from 'react';
import { Outlet, useMatch, useNavigate } from 'react-router';

import { APP_ROUTES_KEY } from '@/router/routes';

const ProfileLayout: FC = () => {
  const matches = useMatch(APP_ROUTES_KEY.profile.settings.path);
  const navigate = useNavigate();

  useEffect(() => {
    if (!matches) {
      navigate(APP_ROUTES_KEY.profile.settings.path);
    }
  }, [matches, navigate]);
  return (
    <div className="w-full h-dvh">
      <Outlet />
    </div>
  );
};

export default ProfileLayout;
