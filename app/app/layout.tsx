import { StyleProvider } from "../../providers/StyleProvider";
import LayoutContent from "../../components/app/LayoutContent";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <StyleProvider>
            <LayoutContent>
                {children}
            </LayoutContent>
        </StyleProvider>
    );
}
