import type { FC } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { TbLoader2 } from 'react-icons/tb';
import { toast } from 'sonner';
import { useImmerAtom } from 'jotai-immer';

import authLoginPageState from '../_state';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppTranslate, useSecondsCountDown } from '@/hook';
import { I18_KEYS } from '@/services/i18';
import { Heading2, Muted, Paragraph } from '@/components/ui/typography';
import { APP_KEYS, REGEX } from '@/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useReactQueryApi } from '@/hook/app';
import { cookies } from '@/utils/cookies';
import { ROUTES_KEY } from '@/router';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { PasswordInput } from '@/components/ui/password-input';

const AuthLoginPageSetPassword: FC = () => {
  const navigate = useNavigate();
  const cookie = cookies();
  const countDown = useSecondsCountDown(150);
  const [pageState] = useImmerAtom(authLoginPageState);

  const { t } = useAppTranslate(I18_KEYS.RESOURCES.MAIN);
  const reactQueryApi = useReactQueryApi();
  const formSchema = z
    .object({
      password: z
        .string({})
        .transform((value) => {
          let normalized = value.trim();

          if (normalized.startsWith('+98')) {
            normalized = normalized.replace('+98', '0');
          }

          if (/^9\d{9}$/.test(normalized)) {
            normalized = `0${normalized}`;
          }

          return normalized;
        })
        .refine((value) => REGEX.password.test(value), {
          message: t('common.validationErrors.password'),
        }),
      confirmPassword: z.string({}),
      otp: z
        .string({})
        .length(6, {
          error: t('common.validationErrors.equalCharacter', {
            name: t('pages.auth.login.setPasswordForm.otp.label'),
            length: 6,
          }),
        })
        .refine((value) => REGEX.number.test(value), {
          message: t('common.validationErrors.number', {
            name: t('pages.auth.login.setPasswordForm.otp.label'),
          }),
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('common.validationErrors.passwordMatch'),
      path: ['confirmPassword'],
    });

  const setPassword = reactQueryApi.useMutation('post', '/user/set-password/', {
    onSuccess(data) {
      cookie.set(APP_KEYS.COOKIES.ACCESS_TOKEN, data.token);
      navigate(ROUTES_KEY.root.path);
      toast.success(t('pages.auth.login.setPasswordForm.successSetPasswordToast'));
    },
  });

  const resetPasswordQuery = reactQueryApi.useMutation('post', '/user/reset-password/', {
    onSuccess(data) {
      cookie.set(APP_KEYS.COOKIES.ACCESS_TOKEN, data.token);
      toast.info(t('pages.auth.login.successSendOtp'));
      countDown.setSeconds(150);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: '',
      password: '',
      confirmPassword: '',
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await setPassword.mutateAsync({
      body: {
        password: values.password,
        otp_code: values.otp,
      },
    });
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>
          <Heading2 className="text-center">{t('pages.auth.login.setPasswordForm.title')}</Heading2>
        </CardTitle>
        <CardDescription>
          <Paragraph className="text-center">
            {t('pages.auth.login.setPasswordForm.description')}
          </Paragraph>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t('pages.auth.login.setPasswordForm.password.label')}</FormLabel>
                  <FormControl>
                    <PasswordInput dir="ltr" {...field} />
                  </FormControl>
                  {fieldState.error ? (
                    <FormMessage />
                  ) : (
                    <Muted>{t('pages.auth.login.setPasswordForm.password.description')}</Muted>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>
                    {t('pages.auth.login.setPasswordForm.confirmPassword.label')}
                  </FormLabel>
                  <FormControl>
                    <PasswordInput dir="ltr" {...field} />
                  </FormControl>
                  {fieldState.error ? (
                    <FormMessage />
                  ) : (
                    <Muted>
                      {t('pages.auth.login.setPasswordForm.confirmPassword.description')}
                    </Muted>
                  )}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="otp"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t('pages.auth.login.setPasswordForm.otp.label')}</FormLabel>
                  <FormControl>
                    <InputOTP type="number" maxLength={6} {...field}>
                      <InputOTPGroup dir="ltr">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  {fieldState.error ? (
                    <FormMessage />
                  ) : (
                    <Muted>{t('pages.auth.login.setPasswordForm.otp.description')}</Muted>
                  )}
                </FormItem>
              )}
            />
            <div className="space-y-2">
              {countDown.seconds <= 0 ? (
                <Button
                  type="button"
                  onClick={async () => {
                    await resetPasswordQuery.mutateAsync({
                      body: { phone_number: pageState.mobile },
                    });
                  }}
                  variant="link"
                >
                  {t('pages.auth.login.setPasswordForm.resend')}
                </Button>
              ) : (
                <Muted className="py-2">
                  {t('pages.auth.login.setPasswordForm.resendUntil', {
                    time: countDown.formatted,
                  })}
                </Muted>
              )}
            </div>
            <Button
              className="w-full"
              type="submit"
              disabled={setPassword.isPending || countDown.seconds <= 0}
            >
              {setPassword.isPending ? (
                <TbLoader2 className="animate-spin" />
              ) : (
                t('pages.auth.login.setPasswordForm.submit')
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AuthLoginPageSetPassword;
