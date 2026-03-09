"use client";
import Navbar from "../../components/app/Navbar";
import { ActivityProvider } from "../../providers/ActivitiesProvider";
import {  useStyle } from "../../providers/StyleProvider";

export default function LayoutContent({ children }) {
    const { visibleNav } = useStyle();

    return (
        <div className="flex min-h-screen">
            {visibleNav &&
            <div className="w-fit border-r-2">
                <Navbar />
            </div>
            }

            <div className="flex-1 pl-1 pt-1">
                <ActivityProvider>
                    {children}
                </ActivityProvider>
            </div>
        </div>
    );
}