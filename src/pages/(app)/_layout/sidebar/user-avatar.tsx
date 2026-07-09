import { UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function AppLayoutSidebarUserAvatar() {
  return (
    <Avatar className="h-8 w-8 rounded-lg">
      <AvatarImage />
      <AvatarFallback className="rounded-lg">
        <UserRound />
      </AvatarFallback>
    </Avatar>
  );
}

export default AppLayoutSidebarUserAvatar;
