import { useState } from "react";
import { BOOKING_STATUS, type BookingStatus } from "../types/booking.types";
import { useBookingStatus } from "../hooks/useBookingStatus";
import { ConfirmDialog } from "./ConfirmDialog";

interface StatusActionButtonsProps {
  bookingId: string;
  status: BookingStatus;
}

type PendingAction = "confirm" | "cancel" | "complete" | null;

/**
 * Only renders the actions that make sense to *offer* for the booking's
 * current status. The backend is still the sole authority on whether a
 * transition is actually allowed (BOOKING_STATUS_TRANSITIONS) — this is
 * just about not inviting an admin to click something that will always be
 * rejected, e.g. "Complete" on a booking that hasn't been confirmed yet.
 */
export function StatusActionButtons({ bookingId, status }: StatusActionButtonsProps) {
  const { confirm, cancel, complete } = useBookingStatus(bookingId);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const isTerminal = status === BOOKING_STATUS.COMPLETED || status === BOOKING_STATUS.CANCELLED;
  const canConfirm = status === BOOKING_STATUS.PAYMENT_SUCCESS;
  const canComplete = status === BOOKING_STATUS.CONFIRMED;
  const canCancel = !isTerminal;

  if (isTerminal) return null;

  const runAction = () => {
    if (pendingAction === "confirm") confirm.mutate();
    if (pendingAction === "cancel") cancel.mutate();
    if (pendingAction === "complete") complete.mutate();
    setPendingAction(null);
  };

  const isMutating = confirm.isPending || cancel.isPending || complete.isPending;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {canConfirm && (
          <button
            type="button"
            onClick={() => setPendingAction("confirm")}
            disabled={isMutating}
            className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            Confirm
          </button>
        )}
        {canComplete && (
          <button
            type="button"
            onClick={() => setPendingAction("complete")}
            disabled={isMutating}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Complete
          </button>
        )}
        {canCancel && (
          <button
            type="button"
            onClick={() => setPendingAction("cancel")}
            disabled={isMutating}
            className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>

      <ConfirmDialog
        open={pendingAction !== null}
        title={
          pendingAction === "confirm"
            ? "Confirm this booking?"
            : pendingAction === "complete"
              ? "Mark this booking as completed?"
              : "Cancel this booking?"
        }
        description={
          pendingAction === "cancel"
            ? "This releases the slot and cannot be undone."
            : "This updates the booking status."
        }
        confirmLabel={pendingAction ? pendingAction[0].toUpperCase() + pendingAction.slice(1) : "Confirm"}
        isLoading={isMutating}
        onConfirm={runAction}
        onCancel={() => setPendingAction(null)}
      />
    </>
  );
}
