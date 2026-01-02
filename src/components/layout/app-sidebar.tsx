"use client";

import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  BrainCircuit,
  CandlestickChart,
  Gem,
  LayoutDashboard,
  Settings,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/icons/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/analysis", icon: BrainCircuit, label: "Market Analysis" },
  { href: "/gems", icon: Gem, label: "Gem Discovery" },
  { href: "/trading", icon: CandlestickChart, label: "Trade Suggestions" },
  { href: "/wallet", icon: Wallet, label: "Wallet" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const userAvatar = PlaceHolderImages.find((img) => img.id === "user-avatar");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center gap-2">
        <div className="flex-none p-1.5 text-primary">
          <Logo className="h-6 w-6" />
        </div>
        <h1 className="font-headline text-lg font-bold">TradeSage</h1>
        <div className="ml-auto flex items-center">
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3 rounded-md p-2 hover:bg-sidebar-accent">
          <Avatar className="h-8 w-8">
            {userAvatar && (
              <AvatarImage
                src={userAvatar.imageUrl}
                alt={userAvatar.description}
                data-ai-hint={userAvatar.imageHint}
                width={32}
                height={32}
              />
            )}
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">John Doe</span>
            <span className="text-xs text-muted-foreground">
              john.doe@example.com
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
