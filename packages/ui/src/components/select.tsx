import { Select as SelectPrimitive } from "@base-ui/react/select";
import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import { cn } from "@perpix/ui/lib/utils";

function Select<Value = string, Multiple extends boolean | undefined = false>(
  props: SelectPrimitive.Root.Props<Value, Multiple>,
) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

type SelectTriggerProps = SelectPrimitive.Trigger.Props & {
  /** Visual error state. Sets border to destructive. */
  error?: boolean;
};

function SelectTrigger({
  className,
  children,
  error = false,
  ...props
}: SelectTriggerProps) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-error={error ? "" : undefined}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-control glass px-3.5 py-2 text-body focus-ring disabled:cursor-not-allowed disabled:opacity-50 pointer-coarse:h-11 [&_svg]:size-4 [&_svg]:shrink-0",
        error && "border-destructive text-destructive focus-ring-destructive",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        <CaretDownIcon aria-hidden className="text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectValue(props: SelectPrimitive.Value.Props) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

type SelectContentProps = SelectPrimitive.Popup.Props &
  Pick<SelectPrimitive.Positioner.Props, "side" | "align" | "sideOffset">;

function SelectContent({
  className,
  children,
  side = "bottom",
  align = "start",
  sideOffset = 6,
  ...props
}: SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        className="z-50"
        side={side}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={12}
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            "relative isolate max-h-80 max-w-[calc(100vw-1.5rem)] min-w-48 motion-pop overflow-y-auto overscroll-contain rounded-overlay glass p-1.5 shadow-modal outline-none",
            className,
          )}
          {...props}
        >
          {children}
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex min-h-9 w-full cursor-default items-center rounded-control ps-3 pe-8 text-body transition-all duration-75 outline-none select-none active:scale-[0.98] active:bg-primary/15 data-highlighted:bg-primary/10 data-highlighted:text-primary pointer-coarse:min-h-11 data-selected:font-semibold data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute end-2.5 flex items-center justify-center text-primary">
        <CheckIcon aria-hidden className="size-4" weight="bold" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

function SelectGroup(props: SelectPrimitive.Group.Props) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn(
        "px-2.5 py-1.5 text-footnote text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("mx-2 my-1 h-px bg-foreground/12", className)}
      {...props}
    />
  );
}

function SelectEmpty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="select-empty"
      className={cn(
        "py-4 text-center text-footnote text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Select,
  SelectContent,
  SelectEmpty,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  type SelectTriggerProps,
};
