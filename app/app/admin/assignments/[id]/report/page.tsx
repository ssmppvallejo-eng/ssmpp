import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../../../../lib/auth";
import { Role } from "../../../../../../src/core/domain/entities/User";
import AssignmentReport from "../../../../../../components/app/admin/AssignmentReport";

export default async function AssignmentReportPage(
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    const allowed = session?.user.role === Role.ADMINISTRADOR
        || session?.user.role === Role.COORDINADOR
        || session?.user.role === Role.EVALUADOR;

    if (!allowed) {
        redirect("/app");
    }

    const { id } = await params;

    return <AssignmentReport assignmentId={id} />;
}
