"use client"

import { useEffect, useState } from "react"

async function cargarPJS() {
    const res = (await fetch('http://127.0.0.1:8000/api/pejotas/'))
    const tasks = await res.json()
    return tasks
}


export default function CharVisualizer() {
    const [pejotas, setPejotas] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const data = await cargarPJS();
            setPejotas(data);
        }
        fetchData();
    }, [])


    return (

        <div>

            {/**Fondo de pantalla */}
            <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#7c0a02_100%)]"></div>

            {
                <ul>
                    {pejotas.map((pj, index) => (
                        <li key={index}>{JSON.stringify(pj)}</li>
                    ))}
                </ul>
            }
        </div>
    );
}