import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";
import { AccessStatus } from "../../src/core/domain/entities/User";
import { StyleProvider } from "../../providers/StyleProvider";
import LayoutContent from "../../components/app/LayoutContent";
import { ReactNode } from "react";

export default async function AppLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/landing/accounts");
    }

    if (session.user.accessStatus !== AccessStatus.APROBADO) {
        redirect("/landing/accounts/status");
    }

    return (
        <StyleProvider>
            <LayoutContent>
                {children}
            </LayoutContent>
        </StyleProvider>
    );
}
