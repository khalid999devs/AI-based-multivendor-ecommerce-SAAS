"use client";

import useSeller from "@/hooks/useSeller";
import useSidebar from "@/hooks/useSidebar";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import Box from "../box";
import { Sidebar } from "./sidebar.styles";
import Link from "next/link";
import Image from "next/image";
import SidebarItem from "./sidebar.item";
import {
  Banknote,
  BellRing,
  CalendarPlus,
  Home,
  ListOrdered,
  LogOut,
  Mail,
  PackageSearch,
  Settings,
  SquarePlus,
  TicketPercent,
} from "lucide-react";
import SidebarMenu from "./sidebar.menu";

const SideBarWrapper = () => {
  const { activeSideBar, setActiveSideBar } = useSidebar();
  const pathname = usePathname();
  const { seller } = useSeller();

  useEffect(() => {
    setActiveSideBar(pathname);
  }, [pathname, setActiveSideBar]);

  const getIconColor = (route: string) =>
    activeSideBar === route ? "#0085ff" : "#969696";

  return (
    <Box
      css={{
        height: "100%",
        zIndex: 202,
        position: "sticky",
        padding: "8px",
        top: 0,
        overflowY: "scroll",
        scrollbarWidth: "none",
      }}
      className="sidebar-wrapper"
    >
      <Sidebar.Header>
        <Box>
          <Link
            href={"/"}
            className="flex justify-start items-center text-start gap-2 -translate-x-3"
          >
            <Image
              src={"/images/logo.png"}
              alt="Logo"
              width={80}
              height={90}
              className="w-[80px] h-auto"
            />
            <Box>
              <h3 className="text-xl font-medium text-[#ecedee]">
                {seller?.shop?.name || "Shop Name"}
              </h3>
              <h5 className="font-medium text-xs text-[#ecedeecf] whitespace-nowrap overflow-hidden text-ellipsis max-w-[170px] pt-1">
                {seller?.shop?.address || "Shop Address"}
              </h5>
            </Box>
          </Link>
        </Box>
      </Sidebar.Header>

      <div className="block my-3 h-full">
        <Sidebar.Body className="body sidebar">
          <SidebarItem
            href="/dashboard"
            title="Dashboard"
            icon={<Home color={getIconColor("/dashboard")} />}
            isActive={activeSideBar === "/dashboard"}
          />
          <div className="mt-2 block">
            <SidebarMenu title="Main menu">
              <SidebarItem
                href="/dashboard/orders"
                title="Orders"
                icon={
                  <ListOrdered
                    size={26}
                    color={getIconColor("/dashboard/orders")}
                  />
                }
                isActive={activeSideBar === "/dashboard/orders"}
              />
              <SidebarItem
                href="/dashboard/payments"
                title="Payments"
                icon={
                  <Banknote
                    size={26}
                    color={getIconColor("/dashboard/payments")}
                  />
                }
                isActive={activeSideBar === "/dashboard/payments"}
              />
            </SidebarMenu>

            <SidebarMenu title="Products">
              <SidebarItem
                href="/dashboard/create-product"
                title="Create Product"
                icon={
                  <SquarePlus
                    size={24}
                    color={getIconColor("/dashboard/create-product")}
                  />
                }
                isActive={activeSideBar === "/dashboard/create-product"}
              />
              <SidebarItem
                href="/dashboard/all-products"
                title="All Products"
                icon={
                  <PackageSearch
                    size={22}
                    color={getIconColor("/dashboard/all-products")}
                  />
                }
                isActive={activeSideBar === "/dashboard/all-products"}
              />
            </SidebarMenu>

            <SidebarMenu title="Events">
              <SidebarItem
                href="/dashboard/create-event"
                title="Create Event"
                icon={
                  <CalendarPlus
                    size={24}
                    color={getIconColor("/dashboard/create-event")}
                  />
                }
                isActive={activeSideBar === "/dashboard/create-event"}
              />
              <SidebarItem
                href="/dashboard/all-events"
                title="All Events"
                icon={
                  <PackageSearch
                    size={22}
                    color={getIconColor("/dashboard/all-events")}
                  />
                }
                isActive={activeSideBar === "/dashboard/all-events"}
              />
            </SidebarMenu>

            <SidebarMenu title="Controllers">
              <SidebarItem
                href="/dashboard/inbox"
                title="Inbox"
                icon={
                  <Mail size={20} color={getIconColor("/dashboard/inbox")} />
                }
                isActive={activeSideBar === "/dashboard/inbox"}
              />
              <SidebarItem
                href="/dashboard/settings"
                title="Settings"
                icon={
                  <Settings
                    size={22}
                    color={getIconColor("/dashboard/settings")}
                  />
                }
                isActive={activeSideBar === "/dashboard/settings"}
              />
              <SidebarItem
                href="/dashboard/notifications"
                title="Notifications"
                icon={
                  <BellRing
                    size={24}
                    color={getIconColor("/dashboard/notifications")}
                  />
                }
                isActive={activeSideBar === "/dashboard/notifications"}
              />
            </SidebarMenu>

            <SidebarMenu title="Extras">
              <SidebarItem
                href="/dashboard/discount-codes"
                title="Discount Codes"
                icon={
                  <TicketPercent
                    size={22}
                    color={getIconColor("/dashboard/discount-codes")}
                  />
                }
                isActive={activeSideBar === "/dashboard/discount-codes"}
              />
              <SidebarItem
                href="/dashboard/logout"
                title="Logout"
                icon={
                  <LogOut size={20} color={getIconColor("/dashboard/logout")} />
                }
                isActive={activeSideBar === "/dashboard/logout"}
              />
            </SidebarMenu>
          </div>
        </Sidebar.Body>
      </div>
    </Box>
  );
};

export default SideBarWrapper;
