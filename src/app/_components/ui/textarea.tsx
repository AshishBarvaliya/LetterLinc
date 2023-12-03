import * as React from "react";

import { cn } from "@/app/_lib/utils";
import { Label } from "./label";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps & { label?: string }
>(({ className, label, ...props }, ref) => {
  return (
    <div className="flex flex-col h-full">
      {label ? (
        <Label htmlFor={props.id} className="pb-3">
          {label}
        </Label>
      ) : null}
      <textarea
        className={cn(
          "flex min-h-[80px] w-full h-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
