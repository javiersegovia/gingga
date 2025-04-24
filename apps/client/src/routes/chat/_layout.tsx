import { Outlet } from "react-router";
import { authMiddleware } from "~/middleware/auth.middleware";

export const unstable_middleware = [authMiddleware]

export default function ChatLayout() {
  return (
    <div className="flex h-screen w-screen bg-blue-100">
      <Outlet />
    </div>
  )
}
