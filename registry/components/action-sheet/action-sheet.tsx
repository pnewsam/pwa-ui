"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetHeader,
  BottomSheetRoot,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";

export const ActionSheetRoot = BottomSheetRoot;
export const ActionSheetTrigger = BottomSheetTrigger;

export function ActionSheetContent({ className, ...props }: React.ComponentProps<typeof BottomSheetContent>) {
  return <BottomSheetContent data-slot="action-sheet-content" className={cn("bg-muted/95 sm:max-w-md", className)} contentClassName="px-3" {...props} />;
}

export const ActionSheetHeader = BottomSheetHeader;
export const ActionSheetTitle = BottomSheetTitle;
export const ActionSheetDescription = BottomSheetDescription;

export function ActionSheetGroup({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div data-slot="action-sheet-group" role="group" className={cn("isolate mb-2 overflow-hidden rounded-2xl border border-border/70 bg-background shadow-sm", className)} {...props} />;
}

export type ActionSheetItemProps = React.ComponentPropsWithoutRef<"button"> & {
  variant?: "default" | "destructive";
  closeOnSelect?: boolean;
};

export function ActionSheetItem({ variant = "default", closeOnSelect = true, className, ...props }: ActionSheetItemProps) {
  const classes = cn(
    "flex min-h-14 w-full cursor-pointer items-center justify-center gap-2.5 border-b border-border/70 px-4 text-[0.95rem] font-medium outline-none transition-[background-color,color] duration-150 ease-out last:border-b-0 hover:bg-accent focus-visible:bg-accent focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring active:bg-accent/80 disabled:pointer-events-none disabled:opacity-45 [&>svg]:size-[1.125rem] [&>svg]:shrink-0",
    variant === "destructive" && "text-destructive",
    className,
  );

  return closeOnSelect ? (
    <BottomSheetClose data-slot="action-sheet-item" className={classes} {...props} />
  ) : (
    <button type="button" data-slot="action-sheet-item" className={classes} {...props} />
  );
}

export function ActionSheetCancel({ className, ...props }: React.ComponentProps<typeof BottomSheetClose>) {
  return <BottomSheetClose data-slot="action-sheet-cancel" className={cn("mt-2 min-h-14 w-full cursor-pointer rounded-2xl border border-border/70 bg-background px-4 text-[0.95rem] font-semibold shadow-sm outline-none transition-[background-color,color] duration-150 ease-out hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring active:bg-accent/80 disabled:pointer-events-none disabled:opacity-45", typeof className === "string" ? className : undefined)} {...props} />;
}

export const ActionSheet = Object.assign(ActionSheetRoot, {
  Trigger: ActionSheetTrigger,
  Content: ActionSheetContent,
  Header: ActionSheetHeader,
  Title: ActionSheetTitle,
  Description: ActionSheetDescription,
  Group: ActionSheetGroup,
  Item: ActionSheetItem,
  Cancel: ActionSheetCancel,
});
