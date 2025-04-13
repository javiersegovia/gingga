import { Badge } from '@gingga/ui/components/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@gingga/ui/components/avatar'
import { motion } from 'motion/react'

export function WhoIAmSection() {
  return (
    <motion.section
      className="bg-muted/40 flex min-h-screen flex-col items-center justify-center gap-12 p-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-center text-5xl font-bold tracking-tight lg:text-7xl">
        Who I Am
      </h2>
      <ul className="text-muted-foreground mt-6 list-disc space-y-4 pl-6 text-xl lg:text-2xl">
        <li>13+ years in LATAM + UK startups</li>
        <li>Co-founder: HoyTrabajas (YC W22)</li>
        <li>Core Team in FLUVIP / Tappsi</li>
        <li>Software Engineer, MBA</li>
        <li>Now: CEO @ Gingga | Leading AI-native GTM execution</li>
      </ul>
      <p className="text-primary mt-8 text-2xl italic lg:text-3xl">
        &quot;Supporting entrepreneurs is my IKIGAI&quot;
      </p>
    </motion.section>
  )
}
