"use client";
import Link from "next/link";
import React, {useEffect} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";





export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
       
    })
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);


    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log("Login success", response.data);
            toast.success("Login success");
            router.push("/profile");
        } catch (error:any) {
            console.log("Login failed", error.message);
            toast.error(error.message);
        } finally{
        setLoading(false);
        }
    }

    useEffect(() => {
        if(user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);
        } else{
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="flex items-center justify-center min-h-screen py-2 bg-gradient-to-br from-purple-400 to-pink-500">
            <div className="border border-gray-300 rounded-lg p-8 max-w-md w-full bg-white shadow-lg">
                <h1 className="text-3xl mb-4 text-center">🔒 {loading ? "Processing" : "Login"} </h1>
                <hr className="border-gray-400 w-full mb-8" />
                
                <label htmlFor="email" className="mb-2 text-gray-600 block">📧 Email</label>
                <input 
                    className="p-2 border border-gray-300 rounded-lg mb-4 w-full focus:outline-none focus:border-purple-400 text-black transition duration-300 ease-in-out hover:border-purple-500"
                    id="email"
                    type="text"
                    value={user.email}
                    onChange={(e) => setUser({...user, email: e.target.value})}
                    placeholder="Your email"
                />
                <label htmlFor="password" className="mb-2 text-gray-600 block">🔑 Password</label>
                <input 
                    className="p-2 border border-gray-300 rounded-lg mb-4 w-full focus:outline-none focus:border-purple-400 text-black transition duration-300 ease-in-out hover:border-purple-500"
                    id="password"
                    type="password"
                    value={user.password}
                    onChange={(e) => setUser({...user, password: e.target.value})}
                    placeholder="Your password"
                />
                <button
                    onClick={onLogin}
                    disabled={buttonDisabled || loading}
                    className={`p-2 border border-gray-300 rounded-lg mb-4 w-full focus:outline-none focus:border-purple-400 ${buttonDisabled || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600 text-white transition duration-300 ease-in-out'}`}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
                <Link href="/signup" className="text-purple-500 hover:underline block text-center">Visit Signup page</Link>
            </div>
        </div>
    )

}