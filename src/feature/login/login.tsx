import type { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Button, Flex, useToast } from '@chakra-ui/react'

import { PhoneNumberInput } from '@/components/form'
import { useAppTranslate } from '@/hook'
import { useReactQueryApi } from '@/hook/app'

const countries = [{ value: '+98', label: 'IR' }]

interface Inputs {
  phoneNumber: {
    preCode: string
    input: string
  }
}
export const LoginFeature: FC = () => {
  const form = useForm<Inputs>({
    defaultValues: {
      phoneNumber: {
        preCode: countries[0].value,
        input: '',
      },
    },
  })
  const reactQueryApi = useReactQueryApi()
  const sendOtpQuery = reactQueryApi.useMutation('post', '/user/login')
  const { t } = useAppTranslate()
  const toast = useToast()

  // toast({
  //   description: 'TEST',
  //   status: 'error',
  //   position: 'top-right',
  //   isClosable: true,
  //   variant: 'subtle',
  // })

  const handleHandleSubmit = async (data: Inputs) => {
    try {
      const res = await sendOtpQuery.mutateAsync({
        body: {
          phoneNumber: data.phoneNumber.input,
        },
      })
    } catch (error) {}
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleHandleSubmit)}>
        <Flex gap={4} direction={'column'}>
          <PhoneNumberInput
            control={form.control}
            errors={form.formState.errors}
            label={t('feature.login.phoneNumber.label')}
            inputName="input"
            preCodeName="preCode"
            selectOptions={countries}
            name="phoneNumber"
          />
          <Button isLoading={sendOtpQuery.isPending} type="submit" colorScheme="blue">
            {t('feature.login.sendOtp')}
          </Button>
        </Flex>
      </form>
    </FormProvider>
  )
}

export default LoginFeature
