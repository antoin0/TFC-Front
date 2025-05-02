"use client"
import { useState } from 'react';
import router, { useRouter } from 'next/router';

const CLASES = [
    { value: 'stalker', label: 'Stalker' },
    { value: 'mecanico', label: 'Mecanico' },
    { value: 'ciberchaman', label: 'Ciberchaman' },
    { value: 'granjero', label: 'Granjero' },
];

const TRAUMA_RESPONSE = [
    { value: 'stalker', label: 'Cuando entras en pánico, todo aliado cercano debe hacer una salvación de MIEDO' },
    { value: 'mecanico', label: 'Los jugadores cercanos a ti tienen desventaja en las salvaciones de MIEDO' },
    { value: 'ciberchaman', label: 'Cuando fallas una salvación de cordura, todos los jugadores cercanos ganan 1 ESTRÉS' },
    { value: 'granjero', label: 'Una vez por sesión, puedes tener ventaja en un check de PÁNICO' },
];

export default function CreatePersonaje() {
    //const router = useRouter();

    const [formData, setFormData] = useState({
        nombre: '',
        clase: 'stalker',
        fuerza: 0,
        velocidad: 0,
        intelig: 0,
        combat: 0,
        sanity: 0,
        fear: 0,
        cuerpo: 0,
        maxHP: 0,
        maxWounds: 2,
        stress: 2,
        traumaRes: 'stalker',
        dinero: 0,
        armorPoints: 0,
        extras: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Automatically sync traumaRes with clase
        if (name === 'clase') {
            setFormData((prev) => ({
                ...prev,
                clase: value,
                traumaRes: value,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: name === 'extras' ? value : isNaN(value) ? value : parseInt(value, 10),
            }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('127.0.0.1:8000/personajes/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/personaje/list'); // Redirect or success page
            } else {
                console.error('Error al crear personaje');
            }
        } catch (error) {
            console.error('Error en envío:', error);
        }
    };

    return (
        <div>
            <h1>Crear Personaje</h1>
            <form onSubmit={handleSubmit}>
                <label>Nombre: <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required /></label><br />

                <label>Clase:
                    <select name="clase" value={formData.clase} onChange={handleChange}>
                        {CLASES.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>
                </label><br />

                {['fuerza', 'velocidad', 'intelig', 'combat', 'sanity', 'fear', 'cuerpo', 'maxHP', 'maxWounds', 'stress', 'dinero', 'armorPoints'].map((stat) => (
                    <label key={stat}>
                        {stat}: <input type="number" name={stat} value={formData[stat]} onChange={handleChange} required />
                    </label>
                ))}

                <label>Trauma Respuesta:
                    <select name="traumaRes" value={formData.traumaRes} disabled>
                        {TRAUMA_RESPONSE.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                </label><br />

                <label>Extras:<br />
                    <textarea name="extras" maxLength={500} value={formData.extras} onChange={handleChange} />
                </label><br />

                <button type="submit">Crear</button>
            </form>
        </div>
    );
}
