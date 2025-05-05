"use client"

import { useState } from 'react';
import router, { useRouter } from 'next/compat/router';
import { stringify } from 'querystring';

const CLASES = [
  {
    value: 'stalker',
    label: 'Stalker',
    descr:
      '+10 Combate\n+10 Salvación de Cuerpo\n+20 Salvación de Miedo\n+1 Herida\n+++ Skills +++\nAptitud de combate\nAtletismo\nBonus: 1 Expert OR 2 Trained Skills',
  },
  {
    value: 'mecanico',
    label: 'Mecánico',
    descr:
      '+20 Intelecto\n-10 a un atributo\n+60 Salvación de Miedo\n+1 Herida\n+++ Skills +++\nEquipamiento industrial\nChapuzas\nBonus: 1 Expert OR 2 Trained Skills',
  },
  {
    value: 'ciberchaman',
    label: 'Ciberchamán',
    descr:
      '+10 Intelecto\n+5 a un atributo\n+30 Salvación de Cordura\n+++ Skills +++\nMaster skill + expert and trained prerequisite skills\nBonus: 1 trained skill',
  },
  {
    value: 'granjero',
    label: 'Granjero',
    descr:
      '+5 a todos los atributos\n+10 a todas las salvaciones\n+++ Skills +++\nEquipamiento industrial\nPatologia\nBonus: 1 Expert 1 Trained skill',
  },
];

const TRAUMA_RESPONSE = [
  {
    value: 'stalker',
    label: 'Cuando entras en pánico, todo aliado cercano debe hacer una salvación de MIEDO'
  },
  {
    value: 'mecanico',
    label: 'Los jugadores cercanos a ti tienen desventaja en las salvaciones de MIEDO',
  },
  {
    value: 'ciberchaman',
    label: 'Cuando fallas una salvación de cordura, todos los jugadores cercanos ganan 1 ESTRÉS',
  },
  {
    value: 'granjero',
    label: 'Una vez por sesión, puedes tener ventaja en un check de PÁNICO',
  },
];

//Initial form info
const INITIAL_FORM_DATA = {
  usuario: 1,
  nombre: 'Juanito Golondrina',
  clase: 'stalker',
  descr: 'stalker',
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
  extras: 'Parche, bagatela, y alguna descripcion extra que te guste !',
};

export default function CreatePersonaje() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    //sync traumaRes with clase
    if (name === 'clase') {
      setFormData((prev) => ({
        ///...prev para cerciorar que no perdemos informacion del resto de campos al actualizar solo algunos
        ...prev,
        clase: value,
        traumaRes: value,
      }));
    } else {
      //Aseguramos que el resto de campos del form mantienen su tipo (texto o number)
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'extras' || name === 'nombre' ? value : Number(value),
      }));
    }
  };


  //Funcion que devuelve un numero aleatorio entre 1 y 10 (simula tirada de 1d10)
  const rollDice = () => {
    return Math.floor(Math.random()
      * (10 - 1 + 1)) + 1;
  };


  //Logica de enviar al back la informacion del form
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
        router.push('/api/pejotas'); // TODO: Redirect a pagina de visualizar hoja chula (WIP)

      } else {
        console.error(formData)
        console.error('Error al crear personaje');
      }
    } catch (error) {
      console.error('Error en envío:', error);
    }
  };

  // Funciones que manejan las tiradas de dado por cada paso
  const handleStep2 = () => {
    //Stats = 1d10+1d10+25
    setFormData((prev) => ({
      ...prev,
      fuerza: rollDice() + rollDice() + 25,
      velocidad: rollDice() + rollDice() + 25,
      intelig: rollDice() + rollDice() + 25,
      combat: rollDice() + rollDice() + 25,
    }))
  };

  const handleStep3 = () => {
    //Salvaciones = 1d10+1d10+10
    setFormData((prev) => ({
      ...prev,
      sanity: rollDice() + rollDice() + 10,
      fear: rollDice() + rollDice() + 10,
      cuerpo: rollDice() + rollDice() + 10,
    }))
  };

  const handleStep4 = () => {
    //Salud = 1d10+10
    setFormData((prev) => ({
      ...prev,
      maxHP: rollDice() + 10,
    }))
  };


  //Logica del navbar+contenido de cada paso de creacion
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        const claseFocus = CLASES.find(c => c.value === formData.clase)
        return (
          <>
            <label className="block mb-4 w-full">
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
            <label className="block mb-4">
              Información de la clase:
              <div className="bg-black text-white border border-red-500 p-2 mt-1 w-full whitespace-pre-line rounded min-h-[3rem]">
                {claseFocus?.descr || ''}
              </div>
            </label>
          </>
        );
      case 2:
        return (
          <>
            <label className="block mb-4">
              Fuerza:
              <div className="bg-black text-white border border-red-500 p-2 mt-1 w-full">
                {formData.fuerza}
              </div>
            </label>
            <label className="block mb-4">
              Velocidad:
              <div className="bg-black text-white border border-red-500 p-2 mt-1 w-full">
                {formData.velocidad}
              </div>
            </label>
            <label className="block mb-4">
              Inteligencia:
              <div className="bg-black text-white border border-red-500 p-2 mt-1 w-full">
                {formData.intelig}
              </div>
            </label>
            <label className="block mb-4">
              Combate:
              <div className="bg-black text-white border border-red-500 p-2 mt-1 w-full">
                {formData.combat}
              </div>
            </label>
          </>
        );
      case 3:
        return (
          <>
            <label className="block mb-4">
              Cordura:
              <div className="bg-black text-white border border-red-500 p-2 mt-1 w-full">
                {formData.sanity}
              </div>
            </label>
            <label className="block mb-4">
              Miedo:
              <div className="bg-black text-white border border-red-500 p-2 mt-1 w-full">
                {formData.fear}
              </div>
            </label>
            <label className="block mb-4">
              Cuerpo:
              <div className="bg-black text-white border border-red-500 p-2 mt-1 w-full">
                {formData.cuerpo}
              </div>
            </label>
          </>
        );
      case 4:
        return (
          <>
            <label className="block mb-4">
              Salud máxima:
              <div className="bg-black text-white border border-red-500 p-2 mt-1 w-full">
                {formData.maxHP}
              </div>
            </label>
            <label className="block mb-4">
              Heridas máximas:
              <div className="bg-black text-white border border-red-500 p-2 mt-1 w-full">
                {formData.maxWounds}
              </div>
            </label>
            <label className="block mb-4">
              Estrés:
              <div className="bg-black text-white border border-red-500 p-2 mt-1 w-full">
                {formData.stress}
              </div>
            </label>
            <label className="block mb-4">
              Trauma Response:
              <div className="bg-black text-white border border-red-500 p-2 mt-1 w-full">
                {TRAUMA_RESPONSE.find((t) => t.value === formData.traumaRes)?.label}
              </div>
            </label>
          </>
        );
      case 5:
        return (
          <>
            <label className="block mb-4">
              Dinero:
              <div className="bg-black text-white border border-red-500 p-2 mt-1 w-full">
                {formData.dinero}
              </div>
            </label>
            <label className="block mb-4">
              Armor Points:
              <div className="bg-black text-white border border-red-500 p-2 mt-1 w-full">
                {formData.armorPoints}
              </div>
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
        {/*Creamos el form, su contenido es el return de la funcion renderStep */}
        {renderStep()}

        {/* Contenedor de los botones anterior/siguiente/crear */}
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

          {/* Botón de tirar los dados ! (rollear stats)*/}
          {currentStep !== 1 && currentStep !== 5 && (
            <button
              type="button"
              onClick={() => {
                // Llamar a la función adecuada dependiendo del paso (influye en el calculo)
                switch (currentStep) {
                  case 2:
                    handleStep2();
                    break;

                  case 3:
                    handleStep3();
                    break;

                  case 4:
                    handleStep4();
                    break;
                }
              }}
              className="bg-black text-red-500 border border-red-500 p-3 w-full hover:bg-red-500 hover:text-black transition duration-200"
            >
              Roll the dice !
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


          {/* Botón de crear solo en el paso 5 */}
          {currentStep === 5 && (
            <button
              type="submit"
              className="bg-black text-white border border-red-500 p-3 mt-6 w-full hover:bg-red-500 hover:text-black transition duration-200"
            >
              Crear
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
