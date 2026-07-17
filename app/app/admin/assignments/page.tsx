import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../../lib/auth";
import { Role } from "../../../../src/core/domain/entities/User";
import AssignmentsManager from "../../../../components/app/admin/AssignmentsManager";

export default async function AdminAssignmentsPage() {
    const session = await getServerSession(authOptions);

    if (session?.user.role !== Role.ADMINISTRADOR) {
        redirect("/app");
    }

    return <AssignmentsManager />;
}
