"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SkillTree from '../SkillTree/page';

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

//Array de skills con su prerequisito (en forma de array)
const SKILLS = [
  {
    value: 'cirugia',
    label: 'Cirugia',
    prerq: ['primeros_auxilios'],
    tier: "M",
  },
  {
    value: 'primeros_auxilios',
    label: 'Primeros auxilios',
    prerq: ['patologia'],
    tier: "E",
  },
  {
    value: 'patologia',
    label: 'Patologia',
    prerq: [],
    tier: "T",
  },
  {
    value: 'ingenieria',
    label: 'Ingenieria',
    prerq: ['reparaciones'],
    tier: "M",
  },
  {
    value: 'reparaciones',
    label: 'Reparaciones',
    prerq: ['eq_industrial', 'chapuzas'],
    tier: "E",
  },
  {
    value: 'eq_industrial',
    label: 'Equipamiento industrial',
    prerq: [],
    tier: "T",
  },
  {
    value: 'cibernetica',
    label: 'Cibernetica',
    prerq: ['explosivos', 'reparaciones'],
    tier: "M",
  },
  {
    value: 'explosivos',
    label: 'Explosivos',
    prerq: ['chapuzas', 'quimica'],
    tier: "E",
  },
  {
    value: 'chapuzas',
    label: 'Chapuzas',
    prerq: [],
    tier: "T",
  },
  {
    value: 'farmacologia',
    label: 'Farmacologia',
    prerq: ['quimica'],
    tier: "E",
  },
  {
    value: 'quimica',
    label: 'Quimica',
    prerq: [],
    tier: "T",
  },
  {
    value: 'hackeo',
    label: 'Hackeo',
    prerq: ['terminales'],
    tier: "M",
  },
  {
    value: 'terminales',
    label: 'Terminales',
    prerq: ['arqueologia'],
    tier: "E",
  },
  {
    value: 'demonologia',
    label: 'Demonologia',
    prerq: ['esoterica'],
    tier: "M",
  },
  {
    value: 'esoterica',
    label: 'Esoterica',
    prerq: ['arqueologia'],
    tier: "E",
  },
  {
    value: 'arqueologia',
    label: 'Arqueologia',
    prerq: [],
    tier: "T",
  },
  {
    value: 'supervivencia',
    label: 'Supervivencia',
    prerq: ['arqueologia', 'ap_combate'],
    tier: "E",
  },
  {
    value: 'voz_mando',
    label: 'Voz de mando',
    prerq: ['firearms'],
    tier: "M",
  },
  {
    value: 'firearms',
    label: 'Armas de fuego',
    prerq: ['ap_combate'],
    tier: "E",
  },
  {
    value: 'ap_combate',
    label: 'Aptitud de combate',
    prerq: [],
    tier: "T",
  },
  {
    value: 'melee',
    label: 'Cuerpo a cuerpo',
    prerq: ['ap_combate', 'atletismo'],
    tier: "E",
  },
  {
    value: 'atletismo',
    label: 'Atletismo',
    prerq: [],
    tier: "T"
  },
]

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
  habilidades: [],
  extras: 'Describe aquí tu parche y tu bagatela, así como cualquier otra información sobre tu personaje',
};

export default function CreatePersonaje() {

  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const [selectedStat, setSelectedStat] = useState<string | null>();

  const currentClass = CLASES.find(c => c.value === formData.clase);
  const defaultSkills = currentClass?.defaultSkills || [];


  //Funcion que escucha los cambios en el form
  const handleChange = (e: { target: { name: any; value: any; type: any; }; }) => {
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


  //Logica de enviar al back la informacion del form (El personaje)
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const payload = {
      ...formData,
      habilidades: JSON.stringify(formData.habilidades), // convierte el array en string (JSON)
    };

    try {
      //Mandamos el personaje al back de django
      const res = await fetch('http://127.0.0.1:8000/api/pejotas/', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      //Si el personaje fue creado con exito, llevamos al usuario al visualizador
      if (res.ok) {
        router.push('/CharacterVisualizer/');
      } else {
        setFormData(INITIAL_FORM_DATA)
        let href = '/' //redirigir a pagina inicial
        console.error(payload);
        router.push(href);
        console.error('Error al crear personaje');
      }
    } catch (error) {
      setFormData(INITIAL_FORM_DATA)
      let href = '/' //redirigir a pagina inicial
      router.push(href);
      console.error('Error en envío:', error);
    }
  };


  //Funcion que devuelve un numero aleatorio entre 1 y 10 (simula tirada de 1d10)
  const rollDice = () => {
    return Math.floor(Math.random()
      * (10 - 1 + 1)) + 1;
  };


  // Funciones que manejan las tiradas de dado por cada paso
  //Stats = 1d10+1d10+25
  const handleStep2 = () => {
    setFormData((prev) => ({
      ...prev,
      fuerza: rollDice() + rollDice() + 25,
      velocidad: rollDice() + rollDice() + 25,
      intelig: rollDice() + rollDice() + 25,
      combat: rollDice() + rollDice() + 25,
    }))
  };

  //Salvaciones = 1d10+1d10+10
  const handleStep3 = () => {
    setFormData((prev) => ({
      ...prev,
      sanity: rollDice() + rollDice() + 10,
      fear: rollDice() + rollDice() + 10,
      cuerpo: rollDice() + rollDice() + 10,
    }))
  };

  //Salud = 1d10+10
  const handleStep4 = () => {
    setFormData((prev) => ({
      ...prev,
      maxHP: rollDice() + 10,
    }))
  };


  //Logica de ajuste de estadisticas (solo mecanico y ciberchaman)
  const handleStatChange = (stat: string) => {
    let ajuste = 0;
    if (formData.clase === "mecanico") {
      ajuste = -10;
    } else if (formData.clase === "ciberchaman") {
      ajuste = 5;
    }
    else {
      ajuste = 0; //Previene que quede marcado y despues un jugador cambie su clase
    }

    // Si se vuelve a hacer clic en el mismo botón, se deselecciona y se revierte el ajuste
    if (selectedStat === stat) {
      switch (stat) {
        case "Fuerza":
          formData.fuerza -= ajuste;
          break;
        case "Velocidad":
          formData.velocidad -= ajuste;
          break;
        case "Intelecto":
          formData.intelig -= ajuste;
          break;
        case "Combate":
          formData.combat -= ajuste;
          break;
      }
      setSelectedStat(null);
      return;
    }


    // Si ya hay otro stat seleccionado, revertimos ese primero
    if (selectedStat) {
      switch (selectedStat) {
        case "Fuerza":
          formData.fuerza -= ajuste;
          break;
        case "Velocidad":
          formData.velocidad -= ajuste;
          break;
        case "Intelecto":
          formData.intelig -= ajuste;
          break;
        case "Combate":
          formData.combat -= ajuste;
          break;
      }
    }

    // Aplicamos el nuevo ajuste
    switch (stat) {
      case "Fuerza":
        formData.fuerza += ajuste;
        break;
      case "Velocidad":
        formData.velocidad += ajuste;
        break;
      case "Intelecto":
        formData.intelig += ajuste;
        break;
      case "Combate":
        formData.combat += ajuste;
        break;
    }

    setSelectedStat(stat);
  };




  //Logica del navbar+contenido de cada paso de creacion
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        //Nombre, clase, informacion de la clase
        const claseFocus = CLASES.find(c => c.value === formData.clase)
        return (
          <>
            <label className="block mb-4 w-full text-xl">
              Nombre
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="bg-black text-white border border-red-500 p-2 mt-2 mb-5 w-full text-xl"
              />
            </label>
            <span className='font-mono text-xl'>Clase</span>
            <div className="flex gap-2 mt-2 text-xl">
              {CLASES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => handleChange({
                    target: {
                      name: "clase", value: c.value,
                      type: undefined
                    }
                  })}
                  className={`p-2 border w-full  ${formData.clase === c.value
                    ? "bg-red-500 text-black"
                    : "bg-black text-white border-red-500 "
                    }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <label className="block mb-4 mt-5 text-xl">
              Información de la clase:
              <div className="bg-black text-white border border-red-500 p-2 mt-1 w-full whitespace-pre-line rounded min-h-[3rem] ">
                {claseFocus?.descr || ''}
              </div>
            </label>
          </>
        );
      case 2:
        // Estadísticas del personaje (Fuerza, velocidad, inteligencia y combate)
        return (
          <>
            <div className="grid grid-cols-4 gap-4 text-xl">
              <label className="block text-center">
                Fuerza
                <div className="w-24 aspect-square bg-black text-red-500 border border-red-500 mt-1 flex items-center justify-center text-5xl mx-auto">
                  {formData.fuerza}
                </div>
              </label>
              <label className="block text-center">
                Velocidad
                <div className="w-24 aspect-square bg-black text-red-500 border border-red-500 mt-1 flex items-center justify-center text-5xl mx-auto">
                  {formData.velocidad}
                </div>
              </label>
              <label className="block text-center">
                Inteligencia
                <div className="w-24 aspect-square bg-black text-red-500 border border-red-500 mt-1 flex items-center justify-center text-5xl mx-auto">
                  {formData.intelig}
                </div>
              </label>
              <label className="block text-center">
                Combate
                <div className="w-24 aspect-square bg-black text-red-500 border border-red-500 mt-1 flex items-center justify-center text-5xl mx-auto">
                  {formData.combat}
                </div>
              </label>
            </div>
          </>
        );
      case 3:
        // Salvaciones del personaje (cordura, miedo, cuerpo)
        return (
          <>
            <div className="grid grid-cols-3 gap-4 text-xl">
              <label className="block text-center">
                Cordura
                <div className="w-24 aspect-square bg-black text-red-500 border border-red-500 mt-1 flex items-center justify-center text-5xl mx-auto">
                  {formData.sanity}
                </div>
              </label>
              <label className="block text-center">
                Miedo
                <div className="w-24 aspect-square bg-black text-red-500 border border-red-500 mt-1 flex items-center justify-center text-5xl mx-auto">
                  {formData.fear}
                </div>
              </label>
              <label className="block text-center">
                Cuerpo
                <div className="w-24 aspect-square bg-black text-red-500 border border-red-500 mt-1 flex items-center justify-center text-5xl mx-auto">
                  {formData.cuerpo}
                </div>
              </label>
            </div>
          </>
        );
      case 4:
        // Salud maxima, trauma response, ajuste de stats
        return (
          <>
            <div className="grid grid-cols-3 gap-4 mb-4 text-xl">
              <div className="text-center col-span-1">
                <label className="block">Salud máxima</label>
                <div className="w-24 aspect-square bg-black text-red-500 border border-red-500 mt-1 flex items-center justify-center text-5xl mx-auto">
                  {formData.maxHP}
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-center mb-3">Trauma Response</label>
                <div className="bg-black text-red-500 border border-red-500 p-2 mt-1 w-full text-center text-xl">
                  {CLASES.find((t) => t.value === formData.traumaRes)?.traumaResponse}
                </div>
              </div>
            </div>

            {['ciberchaman', 'mecanico'].includes(formData.clase) && (
              // Solo aparecen estos botones para las clases de ciberchaman y mecanico
              <div className="mb-4">
                <div className="block mb-2 font-mono">Ajuste de stats</div>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {["Fuerza", "Velocidad", "Intelecto", "Combate"].map((stat) => (
                    <div key={stat} className="w-full">
                      <button
                        type="button"
                        onClick={() => handleStatChange(stat)}
                        className={`w-full p-2 border transition duration-200 ease-in-out ${selectedStat === stat
                          ? 'bg-red-500 text-black'
                          : 'bg-black text-white border-red-500'
                          }`}
                      >
                        {stat}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        );

      case 5:
        //SkillTree component que me costó vida y media programar
        //Aparecen errores pero son mentira este tio funciona
        return (
          <>
            <h2 className="font-mono mb-2 mt-6 text-xl">Escoge habilidades</h2>
            <SkillTree
              skills={SKILLS}
              //currentClass NUNCA es undefined porque pre-seleccionamos una inicial siempre (cuando se carga el forn)
              maxSelection={currentClass.value === 'ciberchaman' ? 4 : 2}
              selected={formData.habilidades}
              defaultSkills={defaultSkills}
              onChange={(newSkills) => {
                setFormData((prev) => ({ ...prev, habilidades: newSkills }))
              }
              } />
          </>
        );

      case 6:
        //Extras
        return (
          <>
            <label className="block mb-4 text-2xl">
              Extras:
              <textarea
                name="extras"
                maxLength={500}
                value={formData.extras}
                onChange={handleChange}
                className="bg-black text-white border border-red-500 p-2 mt-1 w-full h-32 text-xl"
              />
            </label>
          </>
        );
      default:
        return null;
    }
  };

  return (

    //Encabezado logo
    <div className="bg-black text-white font-mono px-6 pb-4 pt-2 max-w-200 mx-auto">
      <img className="mt-0"
        src="/Demonship_Logo_Full.png"
        alt="Logo principal demonship"
      />
      {/**Fondo */}
      <div className="fixed inset-0 -z-10 w-full h-full [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#7c0a02_100%)]"></div>

      <h1 className="text-red-500 text-3xl uppercase border-b-2 border-red-500 pb-2 mb-6"></h1>

      {/* Barra de Navegación */}
      <div className="flex justify-around mb-6">
        {['1', '2', '3', '4', '5', '6'].map((step) => (
          <button
            key={step}
            onClick={() => setCurrentStep(Number(step))}
            className={`py-2 px-4 border ${currentStep === Number(step) ? 'bg-red-500 text-black ' : 'bg-black text-white border-red-500 hover:bg-red-500 hover:text-black transition duration-200'}`}
          >
            Paso {step}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/*Creamos el form, su contenido es el return de la funcion renderStep */}
        {renderStep()}

        {/* Contenedor de los botones anterior/siguiente/crear */}
        <div className="flex space-x-4 mt-12 text-xl">
          {/* Botón Anterior */}
          {currentStep !== 1 && currentStep !== 6 && (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep) => currentStep - 1)} // Decrementa el paso
              className="bg-black text-white border border-red-500 p-3 w-1/2 hover:bg-red-500 hover:text-black transition duration-200"
            >
              Anterior
            </button>
          )}

          {/* Botón de tirar los dados (rollear stats)*/}
          {currentStep !== 1 && currentStep !== 6 && currentStep !== 5 && (
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
          {currentStep !== 6 && (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep) => currentStep + 1)} // Incrementa el paso
              className="bg-black text-white border border-red-500 p-3 w-full hover:bg-red-500 hover:text-black transition duration-200"
            >
              Siguiente
            </button>
          )}

          {/* Botón de crear solo en el paso 6 */}
          {currentStep === 6 && (
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
