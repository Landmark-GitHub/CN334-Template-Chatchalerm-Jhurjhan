import React, { useState } from "react";
import { motion } from "framer-motion";
import Router from "next/router";

export default function Login() {
  const [login, setLogin] = useState(false);
  const [register, setRegister] = useState(false);

  const stylesLogin = {
    body: {
      width: "100%",
      height: "100%",
      overflow: "hidden",
      backgroundColor: "white",
    },
    textLogo: {
      position: "fixed",
      fontSize: "36px",
      fontWeight: "bold",
      color: "black",
      padding: "10px",
      cursor: "pointer",
    },
    contentLogin: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "calc(100% - 36px - 20px)",
      color: "black",
      fontWeight: "bold",
      fontSize: "72px",
    },
  };

  async function onLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const response = await fetch("http://127.0.0.1:3342/api/token/", {
      method: "POST",
      body: formData,
    });
    // Handle response if necessary
    try {
      const data = await response.json();
      localStorage.setItem("jwt_access", data.access);
      alert("Login success!");
      Router.push('../info/store')
    } catch (error) {
      alert("Your username/password are incorrect!");
    }
  }
  return (
    <main className="h-screen bg-white overflow-hidden">
      <motion.h1
        style={stylesLogin.textLogo}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onClick={() => {
          setLogin(false);
          setRegister(false);
        }}
      >
        PODER
      </motion.h1>
      <motion.div
        style={stylesLogin.contentLogin}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      >
        <motion.h1
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          onClick={() => setLogin(!login)}
        >
          LOGIN
        </motion.h1>
        <h1>|</h1>
        <motion.h1
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          onClick={() => setRegister(!register)}
        >
          REGISTER
        </motion.h1>
        {login ? (
          <>
            <motion.div
              className="p-8 bg-white absolute w-2/4 drop-shadow-md rounded-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <form onSubmit={onLogin} className="grid grid-rows-3 gap-2">
                <h1 className="text-5xl bg-gray-50 pl-2">LOGIN</h1>
                <input
                  name="username"
                  className="text-3xl border-2 p-2 rounded-md border-black w-full"
                  type="text"
                  placeholder="Username"
                ></input>
                <input
                  name="password"
                  className="text-3xl border-2 p-2 rounded-md border-black w-full"
                  type="password"
                  placeholder="Password"
                ></input>
                <div className="flex justify-end">
                  <button
                    className="border-2 border-black text-xl px-4 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring focus:border-gray-500"
                    type="submit"
                  >
                    ENTER
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        ) : (
          <></>
        )}
        {register ? (
          <>
            <motion.div
              className="p-8 bg-white absolute w-2/4 drop-shadow-md rounded-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <form onSubmit={onLogin} className="grid grid-rows-4 gap-2">
                <h1 className="text-5xl bg-gray-50 pl-2">LOGIN</h1>
                <input
                  type="text"
                  className="text-3xl border-2 p-2 rounded-md border-black w-full"
                  placeholder="Username"
                ></input>
                <input
                  type="text"
                  className="text-3xl border-2 p-2 rounded-md border-black w-full"
                  placeholder="Username"
                ></input>
                <input
                  type="text"
                  className="text-3xl border-2 p-2 rounded-md border-black w-full"
                  placeholder="Username"
                ></input>
                <div className="flex justify-end">
                  <button
                    className="border-2 border-black text-xl px-4 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring focus:border-gray-500"
                    type="submit"
                  >
                    ENTER
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        ) : (
          <></>
        )}
      </motion.div>
    </main>
  );
}


{/* <div
style={{ fontSize: "64px" }}
className="w-full flex flex-col justify-center items-center dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
>
<div>CN334 Login form</div>
<form onSubmit={onLogin} className="flex flex-col gap-1 text-3xl">
  <div>
    <label>username : </label>{" "}
    <input
      name="username"
      className="text-3xl border-2 p-2 rounded-md border-black w-full"
      type="text"
      placeholder="cn334"
    />
  </div>
  <div>
    <label>Password : </label>{" "}
    <input
      name="password"
      className="text-3xl border-2 p-2 rounded-md border-black w-full"
      type="password"
      placeholder="password"
    />
  </div>
  <button className="p-2 bg-green-300 rounded-xl my-2" type="submit">
    Login
  </button>
</form>
</div> */}
