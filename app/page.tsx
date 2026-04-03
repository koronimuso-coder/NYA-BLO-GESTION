import { redirect } from "next/navigation";

/**
 * Root page — redirects to the dashboard.
 * AuthGuard inside the dashboard layout handles unauthenticated users.
 */
export default function Home() {
  redirect("/");
}
