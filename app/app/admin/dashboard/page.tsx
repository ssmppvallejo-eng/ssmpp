import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../../lib/auth";
import { Role } from "../../../../src/core/domain/entities/User";
import DashboardManager from "../../../../components/app/admin/DashboardManager";

export default async function AdminDashboardPage() {
    const session = await getServerSession(authOptions);

    if (session?.user.role !== Role.ADMINISTRADOR) {
        redirect("/app");
    }

    return <DashboardManager />;
}
