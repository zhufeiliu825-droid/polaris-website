import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { EventForm } from "../event-form";
import { updateEvent, deleteEvent } from "../actions";

export const metadata = { title: "Admin · Edit event" };

type Params = Promise<{ id: string }>;

export default async function EditEventPage({ params }: { params: Params }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  return (
    <div className="px-8 py-10 max-w-6xl">
      <Link
        href="/admin/events"
        className="inline-flex items-center gap-2 text-sm text-navy-600 hover:text-navy-950 mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> All events
      </Link>
      <h1 className="text-3xl font-light tracking-tight text-navy-950 mb-2">
        {event.title}
      </h1>
      <p className="text-navy-600 mb-8">
        {event.registrationsCount} people registered · created{" "}
        {event.createdAt.toLocaleDateString("en-GB", { dateStyle: "long" })}
      </p>
      <EventForm
        action={updateEvent}
        deleteAction={deleteEvent}
        initial={{
          id: event.id,
          slug: event.slug,
          title: event.title,
          excerpt: event.excerpt,
          body: event.body,
          startsAt: event.startsAt.toISOString(),
          endsAt: event.endsAt.toISOString(),
          // Older events may have been saved as HYBRID. The dropdown
          // dropped that option, so we map any legacy HYBRID → IN_PERSON
          // until staff re-saves with their actual intent.
          format: event.format === "ONLINE" ? "ONLINE" : "IN_PERSON",
          location: event.location,
          sector: event.sector ?? null,
          capacity: event.capacity,
          registrationsCount: event.registrationsCount,
          registrationUrl: event.registrationUrl ?? "",
          published: event.published,
          createdAt: event.createdAt.toISOString(),
        }}
        isEdit
      />
    </div>
  );
}
