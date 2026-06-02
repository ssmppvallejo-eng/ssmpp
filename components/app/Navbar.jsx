import { BsListTask } from "react-icons/bs";

const menu_section = [
    {title: 'Actividades', icon: BsListTask, selected: false },
];

const handle_section_click = (title) => {
    const section = menu_section.findIndex(s=> s.selected === true);
    menu_section[section].selected = false;

    const new_section = menu_section.findIndex(s=> s.title === title);
    menu_section[new_section].selected = true;
}


export default function Navbar (){
    return(
        <nav className="flex flex-col p-1 h-full gap-4 pt-10 pb-10 w-20 bg-sky-100">
            {
                menu_section.map((sec,index)=>{
                    return <Section key={index} sec={sec}></Section> ;
                })
            }

        </nav>
    );
}

function Section ({sec}){
    const Icon = sec.icon;
    return(
        <article onClick={()=>handle_section_click(sec.title)} className="cursor-pointer flex flex-col justify-center text-xs items-center gap-1">
            <Icon className="size-6"></Icon>
            <p>
                {sec.title}
            </p>
        </article>
    );
}