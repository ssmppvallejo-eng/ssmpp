import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../../lib/auth";
import { Role } from "../../../../src/core/domain/entities/User";
import PostgraduatesManager from "../../../../components/app/admin/PostgraduatesManager";

export default async function AdminPostgraduatesPage() {
    const session = await getServerSession(authOptions);

    if (session?.user.role !== Role.ADMINISTRADOR) {
        redirect("/app");
    }

    return <PostgraduatesManager />;
}
