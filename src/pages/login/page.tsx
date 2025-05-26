import { Container, Flex, Text, Title } from '@mantine/core';

import { LoginFeature } from '@/feature/login';
import { useAppTranslate } from '@/hook';

export default function LoginPage() {
  const { t } = useAppTranslate();

  return (
    <div className="tw-h-dvh">
      <Container size={'xs'} className="tw-h-full">
        <Flex
          direction={'column'}
          align={'center'}
          justify={'center'}
          className="tw-h-full"
          gap={'xl'}
        >
          <Title>{t('pages.login.title')}</Title>
          <Text>{t('pages.login.description')}</Text>
          <LoginFeature onFinish={() => {}} />
        </Flex>
      </Container>
    </div>
  );
}
