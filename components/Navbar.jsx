import Link from "next/link";

export default function Navbar(){
    return(
        <nav>
            <div>
                <Link href="/">
                    Home
                </Link>
            </div>
            <div>
                <Link href='/dashboard'>
                    Dashboard
                </Link>
            </div>
            <div>
                <Link href='/accounts'>
                    SignIn
                </Link>
            </div>
        </nav>
    );

}