import type { Metadata } from "next";
import { CommanderShell } from "@/components/commander/commander-shell";

export const metadata: Metadata = { title: "Live Incident", description: "Investigate and mitigate the deterministic Checkout Meltdown incident." };

export default function CommanderPage() {
  return <CommanderShell />;
}
