'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
  PinInput,
  PinInputField,
  HStack,
  VStack,
} from '@chakra-ui/react'

import { LoginFeature } from '@/feature/login'
import { useAppTranslate } from '@/hook'

type PhoneFormValues = {
  phoneNumber: string
}

type OtpFormValues = {
  otp: string
}

export default function LoginPage() {
  const { t } = useAppTranslate()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otpValue, setOtpValue] = useState('')
  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneFormValues>()

  const {
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm<OtpFormValues>()

  const onPhoneSubmit = async (data: PhoneFormValues) => {
    setIsLoading(true)

    try {
      // Simulate API call to send OTP
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log('Phone number submitted:', data.phoneNumber)
      setPhoneNumber(data.phoneNumber)

      toast({
        title: 'OTP Sent',
        description: `A verification code has been sent to ${data.phoneNumber}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      // Move to OTP verification step
      setStep('otp')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Failed to send OTP',
        description: 'An error occurred while sending the verification code',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onOtpSubmit = async () => {
    setIsLoading(true)

    try {
      // Simulate API call to verify OTP
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log('OTP submitted:', otpValue)

      toast({
        title: 'Login successful',
        description: 'Your phone number has been verified',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Verification failed',
        description: 'The verification code is invalid or has expired',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePinChange = (value: string) => {
    setOtpValue(value)
  }

  const handleResendOtp = async () => {
    try {
      // Simulate API call to resend OTP
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: 'OTP Resent',
        description: `A new verification code has been sent to ${phoneNumber}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Failed to resend OTP',
        description: 'An error occurred while sending the verification code',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleBackToPhone = () => {
    setStep('phone')
    setOtpValue('')
  }

  return (
    <Flex sx={{ height: '100dvh' }}>
      <Container maxW={'container.sm'}>
        <Flex
          direction={'column'}
          alignItems={'center'}
          justifyContent={'center'}
          sx={{ height: '100%' }}
        >
          <Box
            p={'4'}
            gap={'4'}
            display={'flex'}
            justifyContent={'center'}
            flexDirection={'column'}
            alignItems={'center'}
          >
            <Heading>{t('pages.login.title')}</Heading>
            <Text>{t('pages.login.description')}</Text>
            <LoginFeature />
          </Box>
        </Flex>
      </Container>
    </Flex>
  )
  return (
    <Container maxW="md" py={12}>
      <Box p={8} borderWidth="1px" borderRadius="lg" boxShadow="lg" bg="white">
        <Flex direction="column" align="center" mb={6}>
          <Heading as="h1" size="xl" color="brand.600" mb={2}>
            Login
          </Heading>
          {step === 'phone' ? (
            <Text color="gray.600">Please enter your phone number to continue</Text>
          ) : (
            <Text color="gray.600">Enter the verification code sent to {phoneNumber}</Text>
          )}
        </Flex>

        {step === 'phone' ? (
          <form onSubmit={handleSubmit(onPhoneSubmit)}>
            <FormControl isInvalid={!!errors.phoneNumber} mb={6}>
              <FormLabel htmlFor="phoneNumber" color="gray.700">
                Phone Number
              </FormLabel>
              <Input
                id="phoneNumber"
                placeholder="Enter your phone number"
                focusBorderColor="brand.500"
                {...register('phoneNumber', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                    message: 'Please enter a valid phone number',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.phoneNumber && errors.phoneNumber.message}
              </FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              width="full"
              size="lg"
              isLoading={isLoading}
              loadingText="Sending OTP"
            >
              Send Verification Code
            </Button>
          </form>
        ) : (
          <VStack spacing={6} align="stretch">
            <FormControl isInvalid={!!otpErrors.otp}>
              <FormLabel htmlFor="otp" color="gray.700" textAlign="center">
                Verification Code
              </FormLabel>
              <HStack justify="center" spacing={4}>
                <PinInput
                  size="lg"
                  otp
                  value={otpValue}
                  onChange={handlePinChange}
                  focusBorderColor="brand.500"
                >
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
              <FormErrorMessage>{otpErrors.otp && otpErrors.otp.message}</FormErrorMessage>
            </FormControl>

            <Button
              onClick={onOtpSubmit}
              width="full"
              size="lg"
              isLoading={isLoading}
              loadingText="Verifying"
              isDisabled={otpValue.length !== 6}
            >
              Verify
            </Button>

            <Flex justify="space-between" mt={2}>
              <Button variant="link" colorScheme="brand" onClick={handleBackToPhone} size="sm">
                Change Phone Number
              </Button>
              <Button variant="link" colorScheme="brand" onClick={handleResendOtp} size="sm">
                Resend Code
              </Button>
            </Flex>
          </VStack>
        )}
      </Box>
    </Container>
  )
}
