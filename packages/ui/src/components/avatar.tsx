import type { ComponentProps } from "react";
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@perpix/ui/lib/utils";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full border border-glass-edge-light shadow-raised",
  {
    variants: {
      size: {
        xs: "size-6 text-[10px]",
        sm: "size-8 text-caption",
        default: "size-10 text-body pointer-coarse:size-11",
        lg: "size-12 text-headline pointer-coarse:size-14",
        xl: "size-16 text-title-2 pointer-coarse:size-20",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

type AvatarStatus = "online" | "offline" | "busy" | "away";

const statusClasses: Record<AvatarStatus, string> = {
  online: "bg-success",
  offline: "bg-muted-foreground/60",
  busy: "bg-destructive",
  away: "bg-warning",
};

/**
 * Extracts compact 1-2 letter initials from a person or entity name.
 * Cleanly handles Persian/Arabic and Latin characters.
 */
function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "";
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return Array.from(words[0])[0]?.toUpperCase() ?? "";
  }
  const first = Array.from(words[0])[0] ?? "";
  const last = Array.from(words[words.length - 1])[0] ?? "";
  return `${first}${last}`.toUpperCase();
}

type AvatarProps = AvatarPrimitive.Root.Props &
  VariantProps<typeof avatarVariants> & {
    /** Status indicator dot shown at the bottom-end corner. */
    status?: AvatarStatus;
    /**
     * User or entity name. Automatically generates fallback initials
     * and populates aria-label when children is omitted.
     */
    name?: string;
  };

function Avatar({
  className,
  size,
  status,
  name,
  children,
  ...props
}: AvatarProps) {
  const content =
    children ?? (name ? <AvatarFallback>{getInitials(name)}</AvatarFallback> : null);

  return (
    <div className="relative inline-flex shrink-0 rounded-full">
      <AvatarPrimitive.Root
        data-slot="avatar"
        aria-label={name}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        {content}
      </AvatarPrimitive.Root>
      {status ? (
        <span
          data-slot="avatar-status"
          data-status={status}
          aria-hidden
          className={cn(
            "absolute bottom-0 end-0 rounded-full border-2 border-background ring-1 ring-glass-edge-light",
            size === "xs" && "size-2 border-[1px]",
            size === "sm" && "size-2.5",
            (!size || size === "default") && "size-3",
            size === "lg" && "size-3.5",
            size === "xl" && "size-4 border-[3px]",
            statusClasses[status],
          )}
        />
      ) : null}
    </div>
  );
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full glass font-semibold text-foreground select-none",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroup({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "flex items-center *:rounded-full *:ring-2 *:ring-background [&>*+*]:-ms-2.5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
  avatarVariants,
  getInitials,
  type AvatarProps,
  type AvatarStatus,
};
