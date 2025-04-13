import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components'

interface ContactFormEmailProps {
  name: string
  email: string
  message: string
}

export default function ContactFormEmail({
  name,
  email,
  message,
}: ContactFormEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New Contact Form Submission from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading as="h1" style={h1}>
            New Contact Form Submission
          </Heading>

          <Section style={section}>
            <Text style={labelText}>Name:</Text>
            <Text style={valueText}>{name}</Text>

            <Text style={labelText}>Email:</Text>
            <Text style={valueText}>{email}</Text>

            <Hr style={hr} />

            <Text style={labelText}>Message:</Text>
            <Text style={messageText}>{message}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            This email was sent from the contact form on your website.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  padding: '40px 0',
}

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  borderRadius: '8px',
  margin: '0 auto',
  padding: '40px',
  maxWidth: '600px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 24px',
  textAlign: 'center' as const,
}

const section = {
  margin: '20px 0 30px',
}

const labelText = {
  color: '#666',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '10px 0 5px',
}

const valueText = {
  color: '#333',
  fontSize: '16px',
  margin: '0 0 20px',
}

const messageText = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 10px',
  whiteSpace: 'pre-wrap' as const,
}

const hr = {
  borderColor: '#f0f0f0',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  marginTop: '20px',
  textAlign: 'center' as const,
}
