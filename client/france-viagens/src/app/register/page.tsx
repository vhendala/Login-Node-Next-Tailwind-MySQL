import AuthInput from "@/components/AuthInput";
import AuthPage from "@/components/AuthPage";
import {useState} from "react";
import axios from "axios";
import Link from "next/link";

function Register() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirPassword, setConfirPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();
        axios.post("http://localhost:8001/api/auth/register",{
            username, 
            email, 
            password, 
            confirPassword
        })
        .then((res)=>{
            console.log(res.data);
            setSuccess(res.data.msg);
            setError('');
        })
        .catch((err)=>{
            console.log(err);
            setError(err.response.data.msg);
            setSuccess('');
        });
    }

    return (
        <AuthPage>
            <h1 className="font-bold text-2xl">REGISTER</h1>
            <AuthInput label="Nome:" newState={setUsername}/>
            <AuthInput label="Email:" newState={setEmail}/>
            <AuthInput label="Senha:" newState={setPassword} IsPassword/>
            <AuthInput label="Confirme a senha:" newState={setConfirPassword} IsPassword/>
            {error.length>0 && <span className="text-red-600">*{error}</span>}
            {success.length>0 && <span className="text-green-600">*{success}</span>}
            <button 
                className="bg-blue-600 py-3 font-bold text-white rounded-lg hover:bg-blue-800" 
                onClick={(e)=>handleRegister(e)}
            >
                Cadastrar-se
            </button>
            <Link href="/login" className="text-center underline">
                Entrar
            </Link>
        </AuthPage>

    );
}

export default Register;