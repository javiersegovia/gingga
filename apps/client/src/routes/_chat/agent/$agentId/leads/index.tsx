import type { Lead } from '@gingga/db/types'
import type { Route } from './+types/index'
import { Badge } from '@gingga/ui/components/badge'
import { Card, CardContent } from '@gingga/ui/components/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gingga/ui/components/tooltip'
import { cn } from '@gingga/ui/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import {
  BookOpen,
  Calendar,
  Mail,
  MessageSquare,
  Phone,
  User,
} from 'lucide-react'
import { href, redirect } from 'react-router'
import { getAgentById, getLeadsByAgentId } from '~/features/agent/agent.service'

export async function loader({ params }: Route.LoaderArgs) {
  const { agentId } = params

  const [agent, leads] = await Promise.all([getAgentById(agentId), getLeadsByAgentId(agentId)])

  if (!agent) {
    return redirect(href('/agents'))
  }

  return { agent, leads }
}

export default function LeadsRoute({ loaderData }: Route.ComponentProps) {
  const { leads } = loaderData

  return (
    <div className="py-10 space-y-2 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold">Leads</h1>
      <p className="text-muted-foreground">
        Track potential customer leads captured by your agent during conversations. Use this registry to follow up and nurture opportunities.
      </p>

      <div className="grid grid-cols-1 gap-4">
        {leads.length === 0 && <div className="text-muted-foreground">No leads found yet.</div>}

        {leads.length > 0 && leads.map(lead => (
          <LeadCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  )
}

interface LeadCardProps {
  lead: Lead & { createdAt: Date, notes?: string | null } // Adjusted type
  onClick?: (id: string) => void
  className?: string
}

export function LeadCard({ lead, onClick, className }: LeadCardProps) {
  // Determine qualification score color
  const getQualificationColor = (score?: number | null) => {
    if (score === null || score === undefined)
      return 'bg-gray-200 text-gray-700' // Handle null/undefined explicitly
    if (score >= 80)
      return 'bg-green-100 text-green-700'
    if (score >= 60)
      return 'bg-emerald-100 text-emerald-700'
    if (score >= 40)
      return 'bg-yellow-100 text-yellow-700'
    if (score >= 20)
      return 'bg-orange-100 text-orange-700'
    return 'bg-red-100 text-red-700'
  }

  // Format time since creation
  const createdAtDate = typeof lead.createdAt === 'number' ? new Date(lead.createdAt) : lead.createdAt
  const timeAgo = createdAtDate instanceof Date && !Number.isNaN(createdAtDate.valueOf())
    ? formatDistanceToNow(createdAtDate, { addSuffix: true })
    : 'Unknown time'

  const qualificationText = lead.qualification || 'Not Qualified' // Default to 'Not Qualified'
  const qualificationScoreText = typeof lead.qualificationScore === 'number' ? ` (${lead.qualificationScore})` : '' // Show score only if it exists

  return (
    <TooltipProvider>
      <Card
        design="grid"
        hover="reverse"
        className={cn(
          'transition-all duration-200',
          onClick && 'cursor-pointer',
          className,
        )}
        onClick={() => onClick?.(lead.id)}
      >
        <CardContent className="p-0">
          {/* Header with name and qualification score */}
          <div className="py-4 border-b border-border flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 rounded-full p-2">
                <User className="h-4 w-4 text-primary" />
              </div>
              {/* Use 'Unknown Name' if fullName is missing */}
              <h4 className="font-medium text-foreground">{lead.fullName || 'Unknown Name'}</h4>
            </div>

            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className={cn(
                      'font-medium text-sm',
                      getQualificationColor(lead.qualificationScore),
                    )}
                  >
                    {/* Improved qualification display */}
                    {qualificationText}
                    {qualificationScoreText}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Qualification Status</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Main content */}
          <div className="p-4 space-y-3">
            {/* Contact information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lead.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground truncate">{lead.email}</span>
                </div>
              )}
              {/* Display '-' if phone is missing */}
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{lead.phone || '-'}</span>
              </div>
            </div>

            {/* Additional information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Display '-' if subjectInterest is missing */}
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-sm text-foreground truncate">{lead.subjectInterest || '-'}</span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Subject Interest</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* Placeholder for location */}
              {/* <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-foreground truncate">{lead.location || '-'}</span>
              </div> */}
            </div>

            {/* Notes section */}
            {lead.notes && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium text-foreground">Notes</h4>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm text-muted-foreground line-clamp-2 cursor-help">
                      {lead.notes}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="text-sm whitespace-pre-wrap">{lead.notes}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}

            {/* Source and timestamp */}
            <div className="flex flex-wrap justify-between items-center pt-4">
              {/* Display '-' if utmSource is missing */}
              {/* <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary" className="text-xs">
                  {lead.utmSource || 'Unknown Source'}
                </Badge>
              </div> */}

              <div className="flex items-center gap-2 ml-auto">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{timeAgo}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
