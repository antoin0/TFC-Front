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
            <div className="fixed inset-0 -z-10 w-full h-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#7c0a02_100%)]"></div>


            {pejotas.map((pj, index) => {
                // Encontrar la clase correspondiente y obtener su traumaResponse
                const clase = CLASES.find(clase => clase.value === pj["clase"]);
                const traumaResponse = clase ? clase.traumaResponse : 'No especificado';

                return (
                    <div key={index} className="bg-black text-red-500 border-2 border-red-500 p-6 m-6 rounded-sm shadow-md max-w-5xl mx-auto tracking-wider">

                        <h2 className="text-2xl font-bold uppercase border-b-2 border-red-500 pb-2 mb-6 tracking-widest">
                            <span className="text-white">{pj["nombre"]}</span> | {pj["clase"]}
                        </h2>

                        <div className="grid grid-cols-3 gap-x-4 text-sm mb-3">

                            {/* Atributos principales */}
                            <div className="flex flex-col gap-3">
                                <div className="border border-red-500 p-2">
                                    <span className="text-white text-xl">Fuerza:</span>{' '}
                                    <span className="text-xl">{pj["fuerza"]}</span>
                                </div>
                                <div className="border border-red-500 p-2">
                                    <span className="text-white text-xl">Velocidad:</span>{' '}
                                    <span className="text-xl">{pj["velocidad"]}</span>
                                </div>
                                <div className="border border-red-500 p-2">
                                    <span className="text-white text-xl">Intelecto:</span>{' '}
                                    <span className="text-xl">{pj["intelig"]}</span>
                                </div>
                                <div className="border border-red-500 p-2">
                                    <span className="text-white text-xl">Combate:</span>{' '}
                                    <span className="text-xl">{pj["combat"]}</span>
                                </div>
                            </div>

                            {/* Salvaciones */}
                            <div className="flex flex-col gap-3 border-l-2 border-red-500 pl-4">
                                <div className="border border-red-500 p-2 mt-5">
                                    <span className="text-white text-xl">Cordura:</span>{' '}
                                    <span className="text-xl">{pj["sanity"]}</span>
                                </div>
                                <div className="border border-red-500 p-2">
                                    <span className="text-white text-xl">Miedo:</span>{' '}
                                    <span className="text-xl">{pj["fear"]}</span>
                                </div>
                                <div className="border border-red-500 p-2">
                                    <span className="text-white text-xl">Cuerpo:</span>{' '}
                                    <span className="text-xl">{pj["cuerpo"]}</span>
                                </div>
                            </div>

                            {/* Salud y otros stats */}
                            <div className="flex flex-col gap-3 border-l-2 border-red-500 pl-4">
                                <div className="border border-red-500 p-2 mt-5">
                                    <span className="text-white text-xl">HP Máx:</span>{' '}
                                    <span className="text-xl">{pj["maxHP"]}</span>
                                </div>
                                <div className="border border-red-500 p-2">
                                    <span className="text-white text-xl">Heridas Máx:</span>{' '}
                                    <span className="text-xl">{pj["maxWounds"]}</span>
                                </div>
                                <div className="border border-red-500 p-2">
                                    <span className="text-white text-xl">Stress:</span>{' '}
                                    <span className="text-xl">{pj["stress"]}</span>
                                </div>
                            </div>
                        </div>

                        {/* TraumaRes */}
                        <div className="grid grid-cols-1 gap-6 mb-6 text-sm">
                            <div className="border border-red-500 p-2">
                                <span className="text-white text-xl"> Trauma Response:</span>  <span className="text-xl">{traumaResponse}</span>
                            </div>
                        </div>

                        {/* Habilidades */}
                        <div className="mb-6 text-sm">
                            <div className="uppercase tracking-widest text-white text-xl">Habilidades:</div>
                            <ul className="list-disc list-inside pl-4 mt-2 space-y-1 text-red-500 text-xl">
                                {JSON.parse(pj["habilidades"]).map((habilidad: string, idx: number) => (
                                    <li key={idx}>{habilidad}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Extras */}
                        <div className="mb-2 text-sm">
                            <div className="uppercase tracking-widest text-white text-xl">Extras:</div>
                            <p className="text-red-500 mt-1 text-xl">{pj["extras"]}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
