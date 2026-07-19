import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../../../lib/auth";
import { Role } from "../../../../../src/core/domain/entities/User";
import InstrumentHistory from "../../../../../components/app/admin/InstrumentHistory";

export default async function AdminInstrumentHistoryPage() {
    const session = await getServerSession(authOptions);

    if (session?.user.role !== Role.ADMINISTRADOR) {
        redirect("/app");
    }

    return <InstrumentHistory />;
}
