/** @jsxImportSource react */
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

// Styles based on contact-form-email.tsx for consistency
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
  whiteSpace: 'pre-wrap' as const, // To preserve formatting in notes
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

// Props will be based on the Leads schema
export interface LeadNotificationEmailProps {
  leadId: string
  agentId?: string | null
  chatId?: string | null
  fullName?: string | null
  email?: string | null
  phone?: string | null
  subjectInterest?: string | null
  notes?: string | null
  createdAt: Date
}

export default function LeadNotificationEmail({
  leadId,
  agentId,
  fullName,
  email,
  phone,
  subjectInterest,
  notes,
  createdAt,
}: LeadNotificationEmailProps) {
  const formattedCreatedAt = createdAt.toLocaleString()
  // const rawMessageObject = rawMessageJson ? JSON.parse(rawMessageJson) : null;

  return (
    <Html>
      <Head />
      <Preview>
        New Lead Captured:
        {fullName || email || 'N/A'}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading as="h1" style={h1}>
            🚀 New Lead Captured!
          </Heading>

          <Section style={section}>
            <Text style={labelText}>Lead ID:</Text>
            <Text style={valueText}>{leadId}</Text>

            {fullName && (
              <>
                <Text style={labelText}>Full Name:</Text>
                <Text style={valueText}>{fullName}</Text>
              </>
            )}

            {email && (
              <>
                <Text style={labelText}>Email:</Text>
                <Text style={valueText}>{email}</Text>
              </>
            )}

            {phone && (
              <>
                <Text style={labelText}>Phone:</Text>
                <Text style={valueText}>{phone}</Text>
              </>
            )}

            {subjectInterest && (
              <>
                <Text style={labelText}>Subject / Interest:</Text>
                <Text style={valueText}>{subjectInterest}</Text>
              </>
            )}

            {agentId && (
              <>
                <Text style={labelText}>Agent ID:</Text>
                <Text style={valueText}>{agentId}</Text>
              </>
            )}

            <Text style={labelText}>Captured At:</Text>
            <Text style={valueText}>{formattedCreatedAt}</Text>

            {notes && (
              <>
                <Hr style={hr} />
                <Text style={labelText}>Notes:</Text>
                <Text style={messageText}>{notes}</Text>
              </>
            )}

            {/* Consider if rawMessageJson needs to be displayed, and how.
                It might be too verbose for an email.
                If needed, could be a formatted JSON block or an attachment.
            {rawMessageJson && (
              <>
                <Hr style={hr} />
                <Text style={labelText}>Raw Conversation Data:</Text>
                <Text style={messageText}>{JSON.stringify(rawMessageObject, null, 2)}</Text>
              </>
            )}
            */}
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            This lead notification was automatically generated.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Example Props for previewing (optional, but helpful for development)
LeadNotificationEmail.PreviewProps = {
  leadId: 'lead_123abc',
  agentId: 'agent_xyz789',
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  subjectInterest: 'Interest in Product X',
  notes: 'Had a great conversation about features A and B. Follow up next week.',
  createdAt: new Date(),
} satisfies LeadNotificationEmailProps
