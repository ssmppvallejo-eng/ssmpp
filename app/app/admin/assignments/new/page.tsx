import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../../../lib/auth";
import { Role } from "../../../../../src/core/domain/entities/User";
import AssignmentCreator from "../../../../../components/app/admin/AssignmentCreator";

export default async function NewAssignmentPage() {
    const session = await getServerSession(authOptions);

    if (session?.user.role !== Role.ADMINISTRADOR) {
        redirect("/app");
    }

    return <AssignmentCreator />;
}
