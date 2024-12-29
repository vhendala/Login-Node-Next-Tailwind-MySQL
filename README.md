# Login-Node-Next-Tailwind-MySQL

## Login Page (Back-End)

We will create a login page for customers of the travel agency **France Viagens**, using technologies such as Node.js, Next.js, Tailwind, and MySQL.

Using **VSCode**, a repository named `france_viagens` was created with two subfolders: `api` and `cliente`. In `france_viagens/api`, the back-end built with Node.js will be stored, while `france_viagens/cliente` will house the front-end built with Next.js.

From the **VSCode terminal**, the following commands were executed in the `france_viagens/api` directory to initialize the `package.json` file, install libraries, and required dependencies, including database connection:

```bash
# Navigate to the 'api' directory
cd france_viagens/api

# Initialize package.json
npm init -y

# Install required dependencies
npm install express mysql dotenv
```

```bash
npm init
npm i express bcrypt body-parser cors dotenv jsonwebtoken mysql 
npm i --save-dev nodemon
```

The libraries are stored in the `france_viagens/api/node_modules` directory. In the `france_viagens/api` directory, the `index.js` file was created as the main file.

In the `package.json` file, the modification was made on line 7:

```javascript
"test": "echo \"Error: no test specified\" && exit 1"
```

By:
```javascript
 "start": "nodemon index.js"
```

It was also added to the `package.json` file on the last line, with the purpose of simplifying imports:
```javascript
"type": "module"
```

Next, in `index.js`, to test the server:
```javascript
import express from "express";

const app = express();

app.listen(8001, () => {
    console.log("Servidor rodando na porta 8001");
});
```

In the command prompt, to confirm functionality: `npm start`

To create the routes, the directory `france_viagens/api/routes` was created, along with the file `user.js`.

```
import express from "express";
import { getUser } from "../controllers/users.js";

const router = express.Router();

router.get("/teste", getUser);

export default router;
```

The directory `france_viagens/api/controllers` was also added, along with the file `users.js`.
```
export const getUser = (req, res)=>{
    res.status(200).json({msg: "funcionando!!!"})
}
```

When adding the `user.js` route to `index.js`, we have:
```
import express from "express";
import userRouter from "./routes/user.js";

const app = express();

app.use("/api/user/", userRouter);

app.listen(8001, () => {
    console.log("Servidor rodando na porta 8001");
});
```

Using **Thunder Client** as a VS Code extension, a collection named `france-viagens` was created, and within it, the GET request `http://localhost:8001/api/user/teste` was added.

The following response was returned, confirming the functionality of the request:

```
{
  "msg": "funcionando"
}
```

Next, using **XAMPP**, the database was created via MySQL with the following command:

```SQL
CREATE DATABASE france_viagens;
USE france_viagens;
CREATE TABLE `france_viagens`.`user`(
    `ID` INT NOT NULL AUTO_INCREMENT,
    `USERNAME` VARCHAR(45) NOT NULL,
    `EMAIL` VARCHAR(100) NOT NULL,
    `PASSWORD` VARCHAR(200) NOT NULL,
    `USERIMG` VARCHAR(300) NULL,
    PRIMARY KEY(`ID`)
) AUTO_INCREMENT=1;
```

Next, the authentication file `france_viagens/api/routes/auth.js` was created for login registration.

```javascript
import express from "express"
import {register} from "../controllers/auth.js"
import {login} from "../controllers/auth.js"

const router = express.Router();

router.post("/register", register)
router.post("/login", login)

export default router;
```

The authentication controller file `france_viagens/api/controllers/auth.js` was also created.

```javascript
export const register = (req, res) => {

}

export const login = (req, res) => {
    
}
```

Next, to safeguard the confidentiality of database connection data, the `.env` and `.gitignore` files were created. Additionally, the file `france_viagens/api/connect.js` was created for database connection.

```javascript
import mysql from "mysql";
import dotenv from "dotenv";

dotenv.config({path: "./.env"})

export const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB
});
```

Subsequently, the `export const register` in `auth.js` within the controllers was completed, including data validation and password encryption.

```javascript
import { db } from "../connect.js";
import bcrypt from "bcrypt";

export const register = (req, res) => {
    const {username, email, password, confirmPassword} = req.body
    if(!username){
        return res.status(422).json({msg:"O nome é obrigatório!"});
    }
    if(!email){
        return res.status(422).json({msg:"O email é obrigatório!"});
    }
    if(!password){
        return res.status(422).json({msg:"A senha é obrigatória!"});
    }
    if(password !== confirmPassword){
        return res.status(422).json({msg:"As senhas não são iguais"});
    }

    db.query(
        "SELECT email FROM user WHERE email = ?",
        [email],
        async (error, data) => {
            if (error) {
                console.log(error);
                return  res.status(500).json({
                    msg:"Aconteceu algum erro no servidor, tente novamente mais tardee",
                });
            }
            if (data.length > 0) {
                return res
                .status(409)
                .json({msg:"Este email já está sendo utilizado"});
            } else{
                const passwordHash = await bcrypt.hash(password, 8);
                db.query(
                    "INSERT INTO user SET ?",
                    { username, email, password: passwordHash },
                    (error) => {
                        if(error){
                            console.log(error);
                            return res.status(500).json({
                                msg:"Aconteceu algum erro no servidor, tente novamente mais tarde2",
                            });
                        } else{
                            return res.status(200).json({
                                msg:"Cadastro efetuado com sucesso!",
                            });
                        }
                    }
                );
            }
        }
    );
}

export const login = (req, res) => {
    
}
```

Updating `index.js` with the `user.js` and `auth.js` routes, and also adding `bodyParser` to facilitate testing with Thunder Client, we then have:

```javascript
import express from "express";
import userRouter from "./routes/user.js";
import authRouter from "./routes/auth.js";
import bodyParser from "body-parser";

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear URL-encoded
app.use(bodyParser.urlencoded({extended: false}));

// Roteadores
app.use("/api/user/", userRouter);
app.use("/api/auth/", authRouter);

// Inicia o servidor
app.listen(8001, () => {
    console.log("Servidor rodando na porta 8001");
});
```

Testing again in Thunder Client, the POST request `http://localhost:8001/api/auth/register` was added using Form Encoded:
```
{
  "msg": "O nome é obrigatório!"
}
```
username teste
```
{
  "msg": "O email é obrigatório!"
}
```
email teste@teste.com
```
{
  "msg": "A senha é obrigatória!"
}
```
password teste123456
```
{
  "msg": "As senhas não são iguais"
}
```
confirmPassword teste123456
```
{
  "msg": "Cadastro efetuado com sucesso!"
}
```
If you attempt to register an already registered email:

```
{
  "msg": "Este email já está sendo utilizado"
}
```

Two encrypted keys (REFRESH and TOKEN) were created for data protection using the following command in the command prompt within the `api` directory:

`node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"`

Next, the login functionality was developed in `auth.js` within the controllers:

```javascript
export const login = (req, res) => {
    const { email, password } = req.body;

    db.query(
        "SELECT * FROM user WHERE email = ?",
        [email],
        async (error, data) => {
            if (error) {
                console.log(error);
                return  res.status(500).json({
                    msg:"Aconteceu algum erro no servidor, tente novamente mais tarde"
                });
            }
            if (data.length == 0) {
                return res.status(404).json({
                    msg:"Usuário não encontrado!"
                });
            } else {
                const user = data[0];
                if (!user.PASSWORD) {
                    return res.status(500).json({
                        msg: "Erro no servidor: senha do usuário não encontrada"
                    });
                }
                const checkPassword = await bcrypt.compare(password, user.PASSWORD);
                if (!checkPassword) {
                    return res.status(422).json({
                        msg:"Senha incorreta!"
                    });
                }

                try {
                    const refreshToken = jwt.sign({
                        exp: Math.floor(Date.now()/1000) + 24 * 60 * 60,
                        id: user.password
                    },
                    process.env.REFRESH,
                    {algorithm: "HS256"}
                    );

                    const token = jwt.sign({
                        exp: Math.floor(Date.now()/1000) + 3600,
                        id: user.password
                    },
                    process.env.TOKEN,
                    {algorithm: "HS256"}
                    );

                    res.status(200).json({
                        msg:"Usuário logado com sucesso!", token, refreshToken
                    });

                } catch(err){
                    console.log(err);
                    return res.status(500).json({
                        msg:"Aconteceu algum erro no servidor, tente novamente mais tarde"
                    });
                }
            }
        }
    );
}
```

Completing the back-end tests in Thunder Client, the POST request `http://localhost:8001/api/auth/login` was added, successfully returning the message "User successfully logged in!" along with the "token" and "refreshToken" for authentication.

## Login Page (Front-End)

First, the following commands were executed to install Next.js:

```
npx create-next-app@latest  
cd france-viagens
npm run dev
npm i axios
```

The files `client/src/register/page.tsx` and `client/src/login/page.tsx` were created for the Registration and Login pages, respectively.

The following programming logic was used on the Login page for user login:

```javascript
const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e:any)=>{
        e.preventDefault()
        axios
            .post("http://localhost:8001/api/auth/login", {email,password})
            .then((res)=>{
            console.log(res.data)
            })
            .catch((err)=>{
            console.log(err)
            })
    }
```

Two components, `AuthPage.tsx` and `AuthInput.tsx`, were created and stored in the `client/src/components/AuthPage.tsx` folder.

In the construction of `AuthPage`, the authentication part for the front-end was implemented:

```javascript
function AuthPage({children}:{children:React.ReactNode}) {
    return (
        <main className="bg-[url('https://zagblogmedia.s3.amazonaws.com/wp-content/uploads/2020/02/10140728/viagem-a-trabalho-scaled.jpg')] bg-no-repeat bg-cover flex min-h-screen flex-col items-center justify-center">
            <form className="flex flex-col bg-white px-6 py-14 rounded-2xl gap-11 text-gray-600 w-1/4">
                {children}
            </form>
        </main>
    );
}

export default AuthPage;
```

And `AuthInput.tsx` for authentication input:

```javascript
interface AuthInputProps {
    newState: (state:string) => void,
    label:string
    IsPassword?:boolean
}
function AuthInput(props:AuthInputProps) {
    return (
        <div className="flex flex-col justify-between items-start">
        <label>{props.label}</label>
            <input 
                type={props.IsPassword?"password":"text"} 
                onChange={(e)=>props.newState(e.currentTarget.value)}
                className="border-gray-400 border-b w-full focus-visible:border-gray-700 focus-visible:border-b focus-visible:outline-none"
            />
        </div>
    );
}

export default AuthInput;
```

Next, the Login page was built:
```javascript
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
```

Subsequently, the Registration page was built:

```javascript
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
```

Thus concluding the Login page.

