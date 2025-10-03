import type { FC } from 'react';
import { Outlet } from 'react-router';

const ProfileLayout: FC = () => {
  return (
    <div className="w-full h-dvh">
      <Outlet />
    </div>
  );
};

export default ProfileLayout;
