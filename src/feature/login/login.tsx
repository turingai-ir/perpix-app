import { useState, type FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Box, Button, Flex } from '@mantine/core';
import { clsx } from 'clsx';

import { PhoneNumberInput, PinInput } from '@/components/form';
import { useAppTranslate } from '@/hook';
import { useReactQueryApi } from '@/hook/app';
import { useCountdown } from '@/hook/use-count-down';
import { useFormateTime } from '@/hook/use-formate-time';
import { cookies } from '@/utils/cookies';
import { APP_KEYS } from '@/utils';

const countries = [{ value: '+98', label: 'IR' }];

interface PhoneInputs {
  phoneNumber: {
    preCode: string;
    input: string;
  };
}

interface OtpInputs {
  pin: string;
}
const STEPS = {
  phone: 0,
  otp: 1,
} as const;

type Steps = (typeof STEPS)[keyof typeof STEPS];

interface LoginFeatureProps {
  onFinish: (token: string) => void;
}
export const LoginFeature: FC<LoginFeatureProps> = ({ onFinish }) => {
  const phoneForm = useForm<PhoneInputs>({
    defaultValues: {
      phoneNumber: {
        preCode: countries[0].value,
        input: '',
      },
    },
  });

  const otpForm = useForm<OtpInputs>({
    defaultValues: {
      pin: '',
    },
  });

  const cookie = cookies();

  const reactQueryApi = useReactQueryApi();
  const sendOtpQuery = reactQueryApi.useMutation('post', '/user/login');
  const verifyOtp = reactQueryApi.useMutation('post', '/user/verify');

  const { t } = useAppTranslate();
  const { formate } = useFormateTime();

  const [currentStep, setCurrentStep] = useState<Steps>(STEPS.phone);
  const { count, startCountdown, resetCountdown, stopCountdown } = useCountdown(60 * 5);

  const handlePhoneForm = async (data: PhoneInputs) => {
    const res = await sendOtpQuery.mutateAsync({
      body: {
        phoneNumber: `${data.phoneNumber.preCode.replace('+98', '0')}${data.phoneNumber.input}`,
      },
    });
    cookie.set(APP_KEYS.COOKIES.ACCESS_TOKEN, res.token);
    resetCountdown();
    startCountdown();
    setCurrentStep(STEPS.otp);
  };

  const handlePinForm = async (data: OtpInputs) => {
    const res = await verifyOtp.mutateAsync({
      body: {
        code: data.pin,
      },
    });
    onFinish(res.token);
    cookie.set(APP_KEYS.COOKIES.ACCESS_TOKEN, res.token);
  };

  const handleChangeNumber = () => {
    stopCountdown();
    setCurrentStep(STEPS.phone);
  };

  if (currentStep === STEPS.phone) {
    return (
      <FormProvider {...phoneForm}>
        <form onSubmit={phoneForm.handleSubmit(handlePhoneForm)} className="tw-w-full">
          <Flex
            gap="xl"
            direction="column"
            justify="center"
            align="center"
            className={clsx([
              {
                'tw-hidden': sendOtpQuery.isSuccess,
              },
            ])}
          >
            <PhoneNumberInput
              control={phoneForm.control}
              errors={phoneForm.formState.errors}
              label={t('feature.login.phoneNumber.label')}
              inputName="input"
              preCodeName="preCode"
              selectOptions={countries}
              name="phoneNumber"
            />
            <Button
              radius="xl"
              className="!tw-w-52"
              loading={sendOtpQuery.isPending}
              type="submit"
              variant="filled"
              color="dark"
            >
              {t('feature.login.sendOtp')}
            </Button>
          </Flex>
        </form>
      </FormProvider>
    );
  }

  return (
    <FormProvider {...otpForm}>
      <form onSubmit={otpForm.handleSubmit(handlePinForm)} className="tw-w-full">
        <Flex
          gap="xl"
          direction="column"
          justify="center"
          align="center"
          className={clsx({
            'tw-hidden': sendOtpQuery.isSuccess,
          })}
        >
          <Box className="tw-w-fit">
            <PinInput
              name="pin"
              control={otpForm.control}
              errors={otpForm.formState.errors}
              length={6}
              label={t('feature.login.otp.label')}
            />
          </Box>
          <Flex gap="md" direction="column" align="center">
            <Button
              radius="xl"
              disabled={count !== 0}
              variant="default"
              color="dark"
              loading={sendOtpQuery.isPending}
            >
              {`${t('feature.login.otp.resend')} ${count ? formate(count) : ''}`}
            </Button>
            <Button radius="xl" type="submit" variant="filled" color="dark" className="!tw-w-52">
              {t('feature.login.otp.login')}
            </Button>
            <Button
              radius="xl"
              loading={verifyOtp.isPending}
              onClick={handleChangeNumber}
              color="dark"
              variant="subtle"
            >
              {t('feature.login.otp.changeNumber')}
            </Button>
          </Flex>
        </Flex>
      </form>
    </FormProvider>
  );
};

export default LoginFeature;
