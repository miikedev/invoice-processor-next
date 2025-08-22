"use server";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SignedIn, UserButton } from "@clerk/nextjs";
import ClientDashboardMain from "@/components/client-dashboard-main";
import { authUserIdAtom, useAtom } from "../store";
import { auth } from "@clerk/nextjs/server";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  
  return (
    // Provider is no longer needed here if your app has a root provider
    <NuqsAdapter>
      <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>

        <ClientDashboardMain userId={userId!}>{children}</ClientDashboardMain>
      </SidebarInset>
      </SidebarProvider>
    </NuqsAdapter>
  );
}