import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../../../lib/auth";
import { Role } from "../../../../../src/core/domain/entities/User";
import AssignmentReview from "../../../../../components/app/admin/AssignmentReview";

export default async function AdminAssignmentDetailPage(
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    const allowed = session?.user.role === Role.ADMINISTRADOR || session?.user.role === Role.COORDINADOR;
    if (!allowed) {
        redirect("/app");
    }

    const { id } = await params;

    return <AssignmentReview assignmentId={id} />;
}
