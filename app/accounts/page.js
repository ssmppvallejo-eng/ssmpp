"use client"
import Link from "next/link";
import {signIn, useSession} from 'next-auth/react'

export default function Accounts (){

    const {data:session} = useSession();
    console.log(session);

    return (
        <button onClick={()=>signIn()} className="rounded-4xl p-2 bg-amber-100">
            Sign In
        </button>
    );
}