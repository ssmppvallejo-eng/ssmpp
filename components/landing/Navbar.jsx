"use client";
import { useRouter } from "next/navigation";

export default function Navbar (){
    const router = useRouter();
    const handleLogin = ()=>{
        router.push(`landing/accounts`)
    }
    return(
        <nav>
            <span onClick={()=>handleLogin()}>
                Iniciar sesion
            </span>
        </nav>
    );
}