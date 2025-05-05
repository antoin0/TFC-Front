"use client"

import { useState } from 'react';
import router, { useRouter } from 'next/compat/router';
import { stringify } from 'querystring';

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

const INITIAL_FORM_DATA = {
  usuario: 1,
  nombre: 'Juanito Alimaña',
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
  extras: 'Describe aqui tu personaje',
};

export default function CreatePersonaje() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

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
        [name]: name === 'extras' || name === 'nombre' ? value : Number(value),
      }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://127.0.0.1:8000/api/pejotas/', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        router.push('/api/pejotas'); // Redirect or success page

      } else {
        console.error(formData)
        console.error('Error al crear personaje');
      }
    } catch (error) {
      console.error('Error en envío:', error);
    }
  };

  //Logica del navbar+contenido de cada paso de creacion
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <label className="block mb-4">
              Nombre:
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="bg-black text-white border border-red-500 p-2 mt-1 w-full"
              />
            </label>
            <label className="block mb-4">
              Clase:
              <select
                name="clase"
                value={formData.clase}
                onChange={handleChange}
                className="bg-black text-white border border-red-500 p-2 mt-1 w-full"
              >
                {CLASES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          </>
        );
      case 2:
        return (
          <>
            <label className="block mb-4">
              Fuerza:
              <input
                type="number"
                name="fuerza"
                value={formData.fuerza}
                onChange={handleChange}
                required
                className="bg-black text-white border border-red-500 p-2 mt-1 w-full"
              />
            </label>
            <label className="block mb-4">
              Velocidad:
              <input
                type="number"
                name="velocidad"
                value={formData.velocidad}
                onChange={handleChange}
                required
                className="bg-black text-white border border-red-500 p-2 mt-1 w-full"
              />
            </label>
            <label className="block mb-4">
              Inteligencia:
              <input
                type="number"
                name="intelig"
                value={formData.intelig}
                onChange={handleChange}
                required
                className="bg-black text-white border border-red-500 p-2 mt-1 w-full"
              />
            </label>
            <label className="block mb-4">
              Combate:
              <input
                type="number"
                name="combat"
                value={formData.combat}
                onChange={handleChange}
                required
                className="bg-black text-white border border-red-500 p-2 mt-1 w-full"
              />
            </label>
          </>
        );
      case 3:
        return (
          <>
            <label className="block mb-4">
              Cordura:
              <input
                type="number"
                name="sanity"
                value={formData.sanity}
                onChange={handleChange}
                required
                className="bg-black text-white border border-red-500 p-2 mt-1 w-full"
              />
            </label>
            <label className="block mb-4">
              Miedo:
              <input
                type="number"
                name="fear"
                value={formData.fear}
                onChange={handleChange}
                required
                className="bg-black text-white border border-red-500 p-2 mt-1 w-full"
              />
            </label>
            <label className="block mb-4">
              Cuerpo:
              <input
                type="number"
                name="cuerpo"
                value={formData.cuerpo}
                onChange={handleChange}
                required
                className="bg-black text-white border border-red-500 p-2 mt-1 w-full"
              />
            </label>
          </>
        );
      case 4:
        return (
          <>
            <label className="block mb-4">
              Salud máxima:
              <input
                type="number"
                name="maxHP"
                value={formData.maxHP}
                onChange={handleChange}
                required
                className="bg-black text-white border border-red-500 p-2 mt-1 w-full"
              />
            </label>
            <label className="block mb-4">
              Heridas máximas:
              <input
                type="number"
                name="maxWounds"
                value={formData.maxWounds}
                onChange={handleChange}
                required
                className="bg-black text-white border border-red-500 p-2 mt-1 w-full"
              />
            </label>
            <label className="block mb-4">
              Estrés:
              <input
                type="number"
                name="stress"
                value={formData.stress}
                onChange={handleChange}
                required
                className="bg-black text-white border border-red-500 p-2 mt-1 w-full"
              />
            </label>
            <label className="block mb-4">
              Trauma Response:
              <select
                name="traumaRes"
                value={formData.traumaRes}
                onChange={handleChange}
                disabled
                className="bg-black text-white border border-red-500 p-2 mt-1 w-full"
              >
                {TRAUMA_RESPONSE.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>
          </>
        );
      case 5:
        return (
          <>
            <label className="block mb-4">
              Dinero:
              <input
                type="number"
                name="dinero"
                value={formData.dinero}
                onChange={handleChange}
                required
                className="bg-black text-white border border-red-500 p-2 mt-1 w-full"
              />
            </label>
            <label className="block mb-4">
              Armor Points:
              <input
                type="number"
                name="armorPoints"
                value={formData.armorPoints}
                onChange={handleChange}
                required
                className="bg-black text-white border border-red-500 p-2 mt-1 w-full"
              />
            </label>
            <label className="block mb-4">
              Extras:
              <textarea
                name="extras"
                maxLength={500}
                value={formData.extras}
                onChange={handleChange}
                className="bg-black text-white border border-red-500 p-2 mt-1 w-full h-32"
              />
            </label>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-black text-white font-mono p-6 max-w-2xl mx-auto border-2 border-red-500">
      <h1 className="text-red-500 text-3xl uppercase border-b-2 border-red-500 pb-2 mb-6">Crear Personaje</h1>

      {/* Barra de Navegación */}
      <div className="flex justify-around mb-6">
        {['1', '2', '3', '4', '5'].map((step) => (
          <button
            key={step}
            onClick={() => setCurrentStep(Number(step))}
            className={`py-2 px-4 border ${currentStep === Number(step) ? 'bg-red-500 text-black' : 'bg-black text-white'}`}
          >
            Paso {step}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {renderStep()}

        {/* Contenedor de los botones en línea */}
        <div className="flex space-x-4 mt-6">
          {/* Botón Anterior */}
          {currentStep !== 1 && currentStep !== 5 && (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep) => currentStep - 1)} // Decrementa el paso
              className="bg-black text-white border border-red-500 p-3 w-1/2 hover:bg-red-500 hover:text-black transition duration-200"
            >
              Anterior
            </button>
          )}

          {/* Botón Siguiente */}
          {currentStep !== 5 && (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep) => currentStep + 1)} // Incrementa el paso
              className="bg-black text-white border border-red-500 p-3 w-full hover:bg-red-500 hover:text-black transition duration-200"
            >
              Siguiente
            </button>
          )}
        </div>

        {/* Botón de crear solo en el paso 5 */}
        {currentStep === 5 && (
          <button
            type="submit"
            className="bg-black text-white border border-red-500 p-3 mt-6 w-full hover:bg-red-500 hover:text-black transition duration-200"
          >
            Crear
          </button>
        )}
      </form>
    </div>
  );
}
