import EventCard from "@/components/ui/EventCard";
import AdBanner from "@/components/ui/AdBanner";
import { getEvents } from "@/lib/api";

export const metadata = {
    title: "Events | Arti Fiksi Media",
    description: "Follow the latest and coolest events from the world of art, culture, and business.",
};

export default async function EventsPage() {
    const events = await getEvents();

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-16 md:px-6">

                <div className="mb-16 text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black font-montserrat-black mb-4 tracking-tighter uppercase">
                        Events
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base">
                        Simak jadwal dan keseruan acara-acara pilihan dari komunitas dan industri kreatif.
                    </p>
                </div>

                {events.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                        <p className="text-lg font-semibold">Belum ada acara yang dipublikasikan.</p>
                    </div>
                ) : (
                    <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                        {events.map((event) => (
                            <div key={event.id} className="h-full">
                                <EventCard event={event} />
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-24">
                    <AdBanner size="leaderboard" className="hidden md:flex" />
                    <AdBanner size="medium-rectangle" className="md:hidden" />
                </div>
            </div>
        </div>
    );
}
