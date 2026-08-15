"use client";

import * as React from "react";
import { Drawer } from "@base-ui/react/drawer";

import { cn } from "@/lib/utils";

export type BottomSheetProps = Drawer.Root.Props;

export function BottomSheetRoot({ swipeDirection = "down", ...props }: BottomSheetProps) {
  return <Drawer.Root swipeDirection={swipeDirection} {...props} />;
}

export function BottomSheetTrigger({ className, ...props }: Drawer.Trigger.Props) {
  return (
    <Drawer.Trigger
      data-slot="bottom-sheet-trigger"
      className={cn("outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", typeof className === "string" ? className : undefined)}
      {...props}
    />
  );
}

export type BottomSheetContentProps = Omit<Drawer.Popup.Props, "className" | "style"> & {
  className?: string;
  contentClassName?: string;
  backdropClassName?: string;
  showHandle?: boolean;
  style?: React.CSSProperties;
};

export function BottomSheetContent({
  className,
  contentClassName,
  backdropClassName,
  showHandle = true,
  children,
  style,
  ...props
}: BottomSheetContentProps) {
  return (
    <Drawer.VirtualKeyboardProvider>
      <Drawer.Portal>
        <Drawer.Backdrop
          data-slot="bottom-sheet-backdrop"
          className={cn(
            "fixed inset-0 z-50 bg-black/48 backdrop-blur-[2px] opacity-[calc(1-var(--drawer-swipe-progress,0))] transition-opacity duration-300 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[swiping]:duration-0",
            backdropClassName,
          )}
        />
        <Drawer.Viewport
          data-slot="bottom-sheet-viewport"
          className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center"
        >
          <Drawer.Popup
            data-slot="bottom-sheet-content"
            className={cn(
              "pointer-events-auto relative flex max-h-[min(92dvh,56rem)] w-full flex-col overflow-hidden rounded-t-[1.75rem] border border-border/80 bg-background text-foreground shadow-[0_-18px_60px_rgb(0_0_0/0.18)] outline-none transition-[transform,translate] duration-[calc(var(--drawer-swipe-strength,1)*300ms)] ease-[cubic-bezier(0.32,0.72,0,1)] data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full data-[swiping]:duration-0 sm:max-w-xl",
              className,
            )}
            style={{
              transform: "translateY(calc(var(--drawer-snap-point-offset, 0px) + var(--drawer-swipe-movement-y, 0px)))",
              ...style,
            }}
            {...props}
          >
            {showHandle ? (
              <div className="flex shrink-0 touch-none justify-center px-4 pb-2 pt-3" aria-hidden="true">
                <div className="h-1.5 w-11 rounded-full bg-muted-foreground/28" />
              </div>
            ) : null}
            <Drawer.Content
              className={cn(
                "min-h-0 overflow-y-auto overscroll-contain px-5 pb-[calc(1.25rem+var(--pwa-safe-bottom,env(safe-area-inset-bottom,0px)))]",
                contentClassName,
              )}
            >
              {children}
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.VirtualKeyboardProvider>
  );
}

export function BottomSheetHeader({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div data-slot="bottom-sheet-header" className={cn("mb-5 space-y-1.5 text-left", className)} {...props} />;
}

export function BottomSheetFooter({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div data-slot="bottom-sheet-footer" className={cn("sticky bottom-0 mt-5 flex flex-col-reverse gap-2 bg-background pb-[var(--drawer-keyboard-inset,0px)] sm:flex-row sm:justify-end", className)} {...props} />;
}

export function BottomSheetTitle({ className, ...props }: Drawer.Title.Props) {
  return <Drawer.Title data-slot="bottom-sheet-title" className={cn("text-lg font-semibold tracking-[-0.025em]", typeof className === "string" ? className : undefined)} {...props} />;
}

export function BottomSheetDescription({ className, ...props }: Drawer.Description.Props) {
  return <Drawer.Description data-slot="bottom-sheet-description" className={cn("text-sm leading-6 text-muted-foreground", typeof className === "string" ? className : undefined)} {...props} />;
}

export function BottomSheetClose({ className, ...props }: Drawer.Close.Props) {
  return <Drawer.Close data-slot="bottom-sheet-close" className={cn("outline-none focus-visible:ring-2 focus-visible:ring-ring", typeof className === "string" ? className : undefined)} {...props} />;
}

export const BottomSheet = Object.assign(BottomSheetRoot, {
  Trigger: BottomSheetTrigger,
  Content: BottomSheetContent,
  Header: BottomSheetHeader,
  Footer: BottomSheetFooter,
  Title: BottomSheetTitle,
  Description: BottomSheetDescription,
  Close: BottomSheetClose,
});
