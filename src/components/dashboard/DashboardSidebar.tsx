import { Building2, Mail, ChartBar, Gift, Plus } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Business Setup",
    icon: Building2,
    href: "/dashboard",
  },
  {
    title: "Create Review Page",
    icon: Plus,
    href: "/dashboard/create-review-page",
  },
  {
    title: "Review Vouchers",
    icon: Gift,
    href: "/dashboard/review-vouchers",
  },
  {
    title: "Email Campaigns",
    icon: Mail,
    href: "/dashboard/email-campaigns",
  },
  {
    title: "Analytics",
    icon: ChartBar,
    href: "/dashboard/analytics",
  },
];

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}