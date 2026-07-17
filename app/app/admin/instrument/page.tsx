import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../../lib/auth";
import { Role } from "../../../../src/core/domain/entities/User";
import InstrumentManager from "../../../../components/app/admin/InstrumentManager";

export default async function AdminInstrumentPage() {
    const session = await getServerSession(authOptions);

    if (session?.user.role !== Role.ADMINISTRADOR) {
        redirect("/app");
    }

    return <InstrumentManager />;
}
