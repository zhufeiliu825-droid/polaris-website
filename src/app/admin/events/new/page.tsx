import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EventForm } from "../event-form";
import { createEvent } from "../actions";

export const metadata = { title: "Admin · New event" };

export default function NewEventPage() {
  return (
    <div className="px-8 py-10 max-w-6xl">
      <Link
        href="/admin/events"
        className="inline-flex items-center gap-2 text-sm text-navy-600 hover:text-navy-950 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> All events
      </Link>
      <h1 className="text-3xl font-light tracking-tight text-navy-950 mb-8">
        Create event
      </h1>
      <EventForm action={createEvent} />
    </div>
  );
}
