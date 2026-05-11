"use client";
import { useRouter } from "next/navigation";


export default function Navbar (){
    const router = useRouter();
    const handleLogin = ()=>{
        router.push(`landing/accounts`)
    }
    return(
        <nav className="flex justify-between items-center px-6 py-2 border-b-1 ">
            <div>
                <span>
                    <img src="/logo.svg" alt="Logo" className="h-16"/>
                </span>
            </div>
            <div className="text-sm flex gap-6 cursor-pointer items-center">
                <span className="">
                    Inicio 
                </span>
                <span>
                    Acerca de mí
                </span>
                <span>
                    Investigación
                </span>
                <span>
                    Sitios de Interés
                </span>
                <span>
                    Contacto
                </span>
                <span onClick={()=>handleLogin()} className="border p-2 px-4 hover:bg-white hover:text-black transition duration-700 bg-black text-white rounded-md">
                    Iniciar Sesión
                </span>
            </div>

        </nav>
    );
}