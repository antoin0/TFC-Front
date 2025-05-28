"use client"

import { useEffect, useState } from "react"

const CLASES = [
    {
        value: 'stalker',
        label: 'Stalker',
        descr:
            '+10 Combate\n+10 Salvación de Cuerpo\n+20 Salvación de Miedo\n+1 Herida\n+++ Skills +++\nAptitud de combate\nAtletismo\nBonus: 1 Expert OR 2 Trained Skills',
        defaultSkills: ['ap_combate', 'atletismo'],
        traumaResponse: 'Cuando entras en pánico, todo aliado cercano debe hacer una salvación de MIEDO'
    },
    {
        value: 'mecanico',
        label: 'Mecánico',
        descr:
            '+20 Intelecto\n-10 a un atributo\n+60 Salvación de Miedo\n+1 Herida\n+++ Skills +++\nEquipamiento industrial\nChapuzas\nBonus: 1 Expert OR 2 Trained Skills',
        defaultSkills: ['eq_industrial', 'chapuzas', 'arqueologia'],
        traumaResponse: 'Los jugadores cercanos a ti tienen desventaja en las salvaciones de MIEDO',
    },
    {
        value: 'ciberchaman',
        label: 'Ciberchamán',
        descr:
            '+10 Intelecto\n+5 a un atributo\n+30 Salvación de Cordura\n+++ Skills +++\nMaster skill + expert and trained prerequisite skills\nBonus: 1 trained skill',
        defaultSkills: [],
        traumaResponse: 'Cuando fallas una salvación de cordura, todos los jugadores cercanos ganan 1 ESTRÉS',
    },
    {
        value: 'granjero',
        label: 'Granjero',
        descr:
            '+5 a todos los atributos\n+10 a todas las salvaciones\n+++ Skills +++\nEquipamiento industrial\nPatologia\nBonus: 1 Expert 1 Trained skill',
        defaultSkills: ['eq_industrial', 'patologia'],
        traumaResponse: 'Una vez por sesión, puedes tener ventaja en un check de PÁNICO',
    },
];

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
        <div className="font-mono">
            {/* Fondo */}
            <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#7c0a02_100%)]"></div>

            {pejotas.map((pj, index) => {
                // Encontrar la clase correspondiente y obtener su traumaResponse
                const clase = CLASES.find(clase => clase.value === pj["clase"]);
                const traumaResponse = clase ? clase.traumaResponse : 'No especificado';

                return (
                    <div key={index} className="bg-black text-red-500 border-2 border-red-500 p-6 m-6 rounded-sm shadow-md max-w-5xl mx-auto tracking-wider">

                        <h2 className="text-2xl font-bold uppercase border-b-2 border-red-500 pb-2 mb-6 tracking-widest">
                            {pj["nombre"]} | {pj["clase"]}
                        </h2>

                        {/* Atributos principales */}
                        <div className="grid grid-cols-4 gap-6 mb-6 text-sm">
                            <div className="border border-red-500 p-2">Fuerza: {pj["fuerza"]}</div>
                            <div className="border border-red-500 p-2">Velocidad: {pj["velocidad"]}</div>
                            <div className="border border-red-500 p-2">Intelecto: {pj["intelig"]}</div>
                            <div className="border border-red-500 p-2">Combate: {pj["combat"]}</div>
                        </div>

                        {/* Salvaciones */}
                        <div className="grid grid-cols-3 gap-6 mb-6 text-sm">
                            <div className="border border-red-500 p-2">Cordura: {pj["sanity"]}</div>
                            <div className="border border-red-500 p-2">Miedo: {pj["fear"]}</div>
                            <div className="border border-red-500 p-2">Cuerpo: {pj["cuerpo"]}</div>
                        </div>

                        {/* Salud y otros stats */}
                        <div className="grid grid-cols-3 gap-6 mb-6 text-sm">
                            <div className="border border-red-500 p-2">HP Máx: {pj["maxHP"]}</div>
                            <div className="border border-red-500 p-2">Heridas Máx: {pj["maxWounds"]}</div>
                            <div className="border border-red-500 p-2">Stress: {pj["stress"]}</div>
                        </div>

                        {/* TraumaRes */}
                        <div className="grid grid-cols-1 gap-6 mb-6 text-sm">
                            <div className="border border-red-500 p-2">
                                Resistencia al Trauma: {traumaResponse}
                            </div>
                        </div>

                        {/* Habilidades */}
                        <div className="mb-6 text-sm">
                            <div className="uppercase tracking-widest text-red-500">Habilidades:</div>
                            <ul className="list-disc list-inside pl-4 mt-2 space-y-1 text-red-300">
                                {JSON.parse(pj["habilidades"]).map((habilidad: string, idx: number) => (
                                    <li key={idx}>{habilidad}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Extras */}
                        <div className="mb-2 text-sm">
                            <div className="uppercase tracking-widest text-red-400">Extras:</div>
                            <p className="text-red-300 mt-1">{pj["extras"]}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
