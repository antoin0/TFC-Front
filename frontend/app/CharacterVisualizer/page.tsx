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