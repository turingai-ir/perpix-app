import type { FC } from 'react';

import { useReactQueryApi } from '@/hook/app';
import LoadingSection from '@/components/custom/loading-section';
import ErrorSection from '@/components/custom/error-section';

const AppPage: FC = () => {
  const reactQueryApi = useReactQueryApi();

  const userInfoQuery = reactQueryApi.useQuery('get', '/user/get-info');

  if (userInfoQuery.isLoading) {
    return (
      <div className="w-full h-dvh mx-auto flex justify-center py-4 items-center ">
        <LoadingSection />
      </div>
    );
  }

  if (userInfoQuery.isError) {
    return (
      <div className="mx-auto flex justify-center py-4 items-center w-full h-dvh">
        <ErrorSection onRetry={() => userInfoQuery.refetch()} />
      </div>
    );
  }
  return <div>TEST</div>;
};

export default AppPage;
