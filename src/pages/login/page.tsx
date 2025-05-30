import { Container, Flex, Text, Title } from '@mantine/core';
import { useNavigate } from 'react-router';

import { LoginFeature } from '@/feature/login';
import { useAppTranslate } from '@/hook';
import { ROUTES_KEY } from '@/router';

export default function LoginPage() {
  const { t } = useAppTranslate();

  const navigate = useNavigate();

  return (
    <div className="tw-h-dvh">
      <Container size="xs" className="tw-h-full">
        <Flex direction="column" align="center" justify="center" className="tw-h-full" gap="xl">
          <Title>{t('pages.login.title')}</Title>
          <Text>{t('pages.login.description')}</Text>
          <LoginFeature
            onFinish={() => {
              navigate(ROUTES_KEY.root.path);
            }}
          />
        </Flex>
      </Container>
    </div>
  );
}
