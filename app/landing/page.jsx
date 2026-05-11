import Navbar from "../../components/landing/Navbar";

import { FaFacebookF,FaLinkedinIn } from "react-icons/fa";
import { FaComputer,FaUserDoctor } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { PiTreePalmBold,PiChalkboardTeacherFill } from "react-icons/pi";


const academicGrades = [
    {grade:'Doctorado en Administración', icon: FaUserDoctor},
    {grade:'Maestría en Administración y Gestión de Instituciones Educativas', icon: PiChalkboardTeacherFill},
    {grade:'Licenciatura en Administración Turística', icon: PiTreePalmBold},
    {grade:'Carrera Técnica en Computación y Procesamiento de Datos', icon: FaComputer},
];

export default function Landing (){
    return(
        <main className="h-screen relative">
            <Navbar></Navbar>

            <div className="h-full ">
                {/*Hero Section*/}
                <div className="px-16 md:h-10/12 flex flex-col justify-between gap-2 pb-4">

                    <div className="flex justify-between items-center flex-1">
                        <div className="flex flex-col gap-8">
                            <div className="size-14 rounded-full bg-radial-[at_25%_25%] from-white to-zinc-900 to-75%"></div>
                            <h1 className="text-6xl leading-tight font-normal tracking-tight text-gray-800">
                                José Víctor Manuel 
                                <br/>
                                <span className="font-medium text-black">Vallejo Córdoba</span>
                            </h1>
                            <h2 className="text-2xl text-gray-800">
                                Doctor en <span className="font-medium text-black">Administración</span>
                            </h2>
                        </div>
                        
                        
                        <div>
                            <span className="">
                                <img src="/logo.svg" alt="Logo" className="size-80 drop-shadow-xl/25"/>
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-14">
                        <div className="flex gap-4 ">
                            <span className="p-z px-4 hover:bg-black hover:text-white bg-white border rounded-md flex justify-center items-center">
                                <FaLinkedinIn className="h-8"/>
                            </span>
                            <span  className="p-2 px-4 hover:bg-black hover:text-white bg-white border rounded-md flex justify-center items-center">
                                <MdEmail className="h-8 "/>
                            </span>
                            <span className="p-2 px-4 hover:bg-black hover:text-white bg-white border rounded-md flex justify-center items-center">
                                <FaFacebookF className="h-5 "/>
                            </span>
                        </div>
                        <div className="flex-1 flex items-center">
                            <div className="h-[1px] bg-gradient-to-l from-black to-white  w-full "></div>
                        </div>
                    </div>
                </div>


                {/*Experience section*/}
                <div className="py-12 px-16 bg-black text-white flex flex-col justify-center gap-6 items-center">
                    <h2 className="text-center text-6xl leading-tight font-medium">Grados Academicos</h2>

                    <div className="grid md:grid-cols-2 grid-cols-1 justify-items-center gap-x-12 gap-8 pt-8">
                        {
                            academicGrades.map((aG,index)=>{
                                const Icon = aG.icon;
                                return(
                                    <article key={index} className="group hover:bg-white transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-105 rounded-4xl border-4 px-2 h-64 w-80 gap-8 border-white flex flex-col justify-center items-center ">
                                        <span className="">
                                            <Icon className="size-16 group-hover:text-black"/>
                                        </span>
                                        <span className="group-hover:text-black text-center text-lg font-medium">{aG.grade}</span>
                                    </article>
                                )

                            })
                        }
                    </div>

                </div>
            </div>
        </main>
    );
}
