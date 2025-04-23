/** @jsxImportSource react */
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { apiEnv } from '~/api-env'

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'HelveticaNeue,Helvetica,Arial,sans-serif',
  textAlign: 'center' as const,
}

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #ddd',
  borderRadius: '5px',
  marginTop: '20px',
  width: '480px',
  maxWidth: '100%',
  margin: '0 auto',
  padding: '12% 6%',
}

const logo = {
  margin: '0 auto',
  maxWidth: '200px',
}

const codeTitle = {
  textAlign: 'center' as const,
}

const codeDescription = {
  textAlign: 'center' as const,
}

// const codeContainer = {
//   background: 'rgba(0,0,0,.05)',
//   borderRadius: '4px',
//   margin: '16px auto 14px',
//   verticalAlign: 'middle',
//   width: '280px',
//   maxWidth: '100%',
// }

// const codeStyle = {
//   color: '#000',
//   display: 'inline-block',
//   paddingBottom: '8px',
//   paddingTop: '8px',
//   margin: '0 auto',
//   width: '100%',
//   textAlign: 'center' as const,
//   letterSpacing: '8px',
// }

const buttonContainer = {
  margin: '27px auto',
  width: 'auto',
}

const button = {
  backgroundColor: '#000000',
  borderRadius: '24px',
  fontWeight: '600',
  color: '#fff',
  textAlign: 'center' as const,
  padding: '12px 24px',
  margin: '0 auto',
}

const paragraph = {
  color: '#444',
  fontSize: '14px',
  letterSpacing: '0',
  padding: '0 40px',
  margin: '0',
  textAlign: 'center' as const,
}

const link = {
  color: '#444',
  textDecoration: 'underline',
}

interface VerificationEmailProps {
  // otp: string
  verifyUrl: string
  title: string
}

export function VerificationEmail({
  title = 'Verification',
  verifyUrl,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${apiEnv.VITE_ASSETS_URL}/logo/logo-light-v2.png`}
            width="168"
            height="29"
            alt="Logo"
            style={logo}
          />

          <Heading style={codeTitle}>{title}</Heading>
          <Text style={codeDescription}>
            Hello there! Click the button below to proceed with the
            verification. It will expire in 10 minutes.
          </Text>
          {/* <Section style={codeContainer}>
            <Heading style={codeStyle}>{otp}</Heading>
          </Section> */}
          <Section style={buttonContainer}>
            <Button href={verifyUrl} style={button}>
              Click here to verify
            </Button>
          </Section>

          <Text style={paragraph}>Not expecting this email?</Text>
          <Text style={paragraph}>
            Contact
            {' '}
            <Link href={`mailto:${apiEnv.VITE_SUPPORT_EMAIL}`} style={link}>
              {apiEnv.VITE_SUPPORT_EMAIL}
            </Link>
            {' '}
            if you did not request this code.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

VerificationEmail.PreviewProps = {
  // otp: '123456',
  title: 'Verify your email',
  verifyUrl: 'http://localhost:3000/verify?otp=123456',
} satisfies VerificationEmailProps

export default VerificationEmail
