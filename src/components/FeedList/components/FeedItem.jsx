import { useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar.jsx";
import FeedIcon from "@/components/ui/FeedIcon";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { useTranslation } from "react-i18next";
import { handleRefresh } from "@/handlers/feedHandlers";
import { handleMarkAllRead } from "@/handlers/articleHandlers";
import { useStore } from "@nanostores/react";
import { getFeedCount } from "@/stores/feedsStore.js";

const FeedItem = ({ feed }) => {
  const { t } = useTranslation();
  const { isMobile, setOpenMobile } = useSidebar();
  const { feedId } = useParams();
  const $getFeedCount = useStore(getFeedCount);
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setIsOpen(true);
  };

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton
        asChild
        className={cn(
          "pl-8 pr-2 h-8",
          parseInt(feedId) === feed.id &&
            "active-feed bg-default/60 rounded-md",
        )}
        onContextMenu={handleContextMenu}
      >
        <Link
          to={`/feed/${feed.id}`}
          onClick={() => isMobile && setOpenMobile(false)}
        >
          <FeedIcon feedId={feed.id} />
          <span className="flex-1 flex items-center gap-1">
            {feed.parsing_error_count > 0 && (
              <span className="text-warning">
                <TriangleAlert className="size-4" />
              </span>
            )}
            <span className="line-clamp-1">{feed.title}</span>
          </span>
          <span className="text-default-400 text-xs">
            {$getFeedCount(feed.id) !== 0 && $getFeedCount(feed.id)}
          </span>
        </Link>
      </SidebarMenuSubButton>
      
      <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
        <DropdownTrigger>
          <div>
            <Button ref={triggerRef} className="hidden" />
          </div>
        </DropdownTrigger>
        <DropdownMenu aria-label="Feed actions">
          <DropdownItem
            key="refresh"
            onPress={() => {
              handleRefresh(feed.id);
              setIsOpen(false);
            }}
          >
            {t("common.refresh")}
          </DropdownItem>
          <DropdownItem
            key="markAllRead"
            onPress={() => {
              handleMarkAllRead("feed", feed.id);
              setIsOpen(false);
            }}
          >
            {t("common.markAllRead")}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </SidebarMenuSubItem>
  );
};

export default FeedItem;
