import { Button } from "@gingga/ui/components/button";
import { href, useNavigate, useRevalidator } from "react-router";
import { authClient } from "~/lib/auth/auth-client";

export default function ChatRoute() {
  const r = useRevalidator()
  const navigate = useNavigate()

  const handleSignOut = () => {
    authClient.signOut({}, {
      async onSuccess() {
        await r.revalidate()
        navigate(href('/'))
      },
    })
  }

  return <div className="mx-auto flex items-center justify-center max-w-screen-xl h-screen flex-col gap-4">
    <p>We are working on this...</p>
    <Button variant="primary" onClick={handleSignOut}>
      Sign out
    </Button>
  </div>
}
