"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = React.ComponentProps<typeof Button> & {
  /** Text shown while the form action is in flight (defaults to children). */
  pendingLabel?: React.ReactNode;
};

/**
 * Submit button that reflects the parent <form>'s pending state via
 * useFormStatus: it disables itself and swaps in a spinner during the server
 * action, so Save / Create / Sign in stop feeling frozen and can't be
 * double-submitted. Must be rendered inside the <form> it submits.
 */
export function SubmitButton({ children, pendingLabel, ...props }: Props) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-busy={pending} {...props}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {pendingLabel ?? children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
