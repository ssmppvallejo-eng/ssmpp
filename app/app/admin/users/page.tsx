import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../../lib/auth";
import { Role } from "../../../../src/core/domain/entities/User";
import UsersManager from "../../../../components/app/admin/UsersManager";

export default async function AdminUsersPage() {
    const session = await getServerSession(authOptions);

    if (session?.user.role !== Role.ADMINISTRADOR) {
        redirect("/app");
    }

    return <UsersManager />;
}
