import type { FC, PropsWithChildren } from 'react';

import { Muted } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { useAppTranslate } from '@/hook';
import { APP_I18_KEYS } from '@/services/i18';

interface Props {
  onRetry?: () => void;
}

const ErrorSection: FC<PropsWithChildren<Props>> = ({ children, onRetry }) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <div className="flex gap-4 flex-col">
      <Muted>{t('components.custom.errorSection.description')}</Muted>
      {onRetry ? (
        <Button onClick={onRetry}>{t('components.custom.errorSection.retry')}</Button>
      ) : null}
      {children}
    </div>
  );
};

export default ErrorSection;
