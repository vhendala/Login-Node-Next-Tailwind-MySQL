"use client"

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import AuthPage from "@/components/AuthPage";
import AuthInput from "@/components/AuthInput";

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e:any)=>{
        e.preventDefault()
        axios
            .post("http://localhost:8001/api/auth/login", {email,password})
            .then((res)=>{
            console.log(res.data);
            setError('');
            })
            .catch((err)=>{
            console.log(err);
            setError(err.response.data.msg)
            })
    }

    return (
        <AuthPage>
            <h1 className="font-bold text-2xl">LOGIN</h1>
            <AuthInput label="Email:" newState={setEmail}/>
            <AuthInput label="Password" newState={setPassword} IsPassword/>
            {error.length>0 && <span className="text-red-600">*{error}</span>}
            <button 
                className="bg-blue-600 py-3 font-bold text-white rounded-lg hover:bg-blue-800" 
                onClick={(e)=>handleLogin(e)}
            >
                ENTRAR
            </button>
            <Link href="/register" className="text-center underline">
                Cadastrar-se
            </Link>
        </AuthPage>
    );
}

export default Login;