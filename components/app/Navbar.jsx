export default function Navbar (){
    return(
        <nav className="flex flex-col p-1 h-full gap-4 pt-10 pb-10">
            <article className="flex justify-center text-sm">
                <p>
                    Actividades
                </p>
            </article>
            <article className="flex justify-center  text-sm">
                <p>
                    Perfil
                </p>
            </article>
        </nav>
    );
}