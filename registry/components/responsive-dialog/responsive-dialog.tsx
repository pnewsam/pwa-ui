"use client";

import * as React from "react";
import { Dialog } from "@base-ui/react/dialog";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetDescription,
  BottomSheetHeader,
  BottomSheetRoot,
  BottomSheetTitle,
  BottomSheetTrigger,
} from "@/components/ui/bottom-sheet";

type ResponsiveDialogContextValue = { mobile: boolean };
const ResponsiveDialogContext = React.createContext<ResponsiveDialogContextValue | null>(null);

function useResponsiveDialogContext() {
  const context = React.useContext(ResponsiveDialogContext);
  if (!context) throw new Error("ResponsiveDialog parts must be used inside ResponsiveDialog.");
  return context;
}

export type ResponsiveDialogProps = {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  breakpoint?: string;
};

export function ResponsiveDialogRoot({
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  breakpoint = "(max-width: 47.999rem)",
}: ResponsiveDialogProps) {
  const mobile = useMediaQuery(breakpoint);
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
  const currentOpen = open ?? uncontrolledOpen;
  const setOpen = (nextOpen: boolean) => {
    if (open === undefined) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  const content = (
    <ResponsiveDialogContext.Provider value={{ mobile }}>
      {children}
    </ResponsiveDialogContext.Provider>
  );

  return mobile ? (
    <BottomSheetRoot open={currentOpen} onOpenChange={setOpen}>{content}</BottomSheetRoot>
  ) : (
    <Dialog.Root open={currentOpen} onOpenChange={setOpen}>{content}</Dialog.Root>
  );
}

export type ResponsiveDialogTriggerProps = React.ComponentPropsWithoutRef<"button"> & {
  render?: React.ReactElement;
};

export function ResponsiveDialogTrigger(props: ResponsiveDialogTriggerProps) {
  const { mobile } = useResponsiveDialogContext();
  return mobile ? <BottomSheetTrigger {...props} /> : <Dialog.Trigger data-slot="responsive-dialog-trigger" {...props} />;
}

export type ResponsiveDialogContentProps = {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  initialFocus?: Dialog.Popup.Props["initialFocus"];
  finalFocus?: Dialog.Popup.Props["finalFocus"];
};

export function ResponsiveDialogContent({ className, children, ...props }: ResponsiveDialogContentProps) {
  const { mobile } = useResponsiveDialogContext();

  if (mobile) {
    return <BottomSheetContent className={className} {...props}>{children}</BottomSheetContent>;
  }

  return (
    <Dialog.Portal>
      <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 motion-reduce:transition-none" />
      <Dialog.Viewport className="fixed inset-0 z-50 grid place-items-center overflow-y-auto p-5">
        <Dialog.Popup
          data-slot="responsive-dialog-content"
          className={cn(
            "w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-background p-6 text-foreground shadow-[0_24px_70px_rgb(0_0_0/0.18)] outline-none transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] data-[ending-style]:scale-[0.97] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0 motion-reduce:transition-none",
            className,
          )}
          {...props}
        >
          {children}
        </Dialog.Popup>
      </Dialog.Viewport>
    </Dialog.Portal>
  );
}

export function ResponsiveDialogHeader(props: React.ComponentPropsWithoutRef<"div">) {
  const { mobile } = useResponsiveDialogContext();
  return mobile ? <BottomSheetHeader {...props} /> : <div data-slot="responsive-dialog-header" {...props} className={cn("mb-5 space-y-1.5", props.className)} />;
}

export function ResponsiveDialogTitle(props: Dialog.Title.Props) {
  const { mobile } = useResponsiveDialogContext();
  const { className, ...titleProps } = props;
  return mobile ? <BottomSheetTitle {...props} /> : <Dialog.Title data-slot="responsive-dialog-title" {...titleProps} className={typeof className === "function" ? (state) => cn("text-lg font-semibold tracking-[-0.025em]", className(state)) : cn("text-lg font-semibold tracking-[-0.025em]", className)} />;
}

export function ResponsiveDialogDescription(props: Dialog.Description.Props) {
  const { mobile } = useResponsiveDialogContext();
  const { className, ...descriptionProps } = props;
  return mobile ? <BottomSheetDescription {...props} /> : <Dialog.Description data-slot="responsive-dialog-description" {...descriptionProps} className={typeof className === "function" ? (state) => cn("text-sm leading-6 text-muted-foreground", className(state)) : cn("text-sm leading-6 text-muted-foreground", className)} />;
}

export function ResponsiveDialogClose(props: Dialog.Close.Props) {
  const { mobile } = useResponsiveDialogContext();
  return mobile ? <BottomSheetClose {...props} /> : <Dialog.Close data-slot="responsive-dialog-close" {...props} />;
}

export const ResponsiveDialog = Object.assign(ResponsiveDialogRoot, {
  Trigger: ResponsiveDialogTrigger,
  Content: ResponsiveDialogContent,
  Header: ResponsiveDialogHeader,
  Title: ResponsiveDialogTitle,
  Description: ResponsiveDialogDescription,
  Close: ResponsiveDialogClose,
});
