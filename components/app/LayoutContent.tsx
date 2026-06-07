"use client";
import { ReactNode } from "react";
import Navbar from "../../components/app/Navbar";
import { ActivityProvider } from "../../providers/ActivitiesProvider";
import { useStyle } from "../../providers/StyleProvider";

export default function LayoutContent({ children }: { children: ReactNode }) {
    const { visibleNav } = useStyle();

    return (
        <div className="min-h-screen bg-stone-50 text-zinc-950 lg:flex">
            {visibleNav &&
                <Navbar />
            }

            <main className="min-w-0 flex-1">
                <ActivityProvider>
                    {children}
                </ActivityProvider>
            </main>
        </div>
    );
}
