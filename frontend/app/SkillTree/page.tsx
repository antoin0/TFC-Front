import { useState, useEffect, useMemo } from 'react';

const TIERS = ['T', 'E', 'M'];

//Definicion de las skills que recibe
interface Skill {
    value: string;
    label: string;
    prerq: string[];
    tier: string;
}


interface Props {
    skills: Skill[];
    selected: string[];
    onChange: (selected: string[]) => void;
    maxSelection: number;
    defaultSkills: string[];
}

export default function SkillTree({ skills, selected, onChange, maxSelection, defaultSkills }: Props) {

    //Creamos los sets de habilidades -> default (dados por la clase) y userSelected (escogidos por el usuario)

    const defaultSkillsSet = useMemo(() => new Set(defaultSkills), [defaultSkills]);
    const [userSelectedSet, setUserSelectedSet] = useState(new Set<string>(selected));
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Combine default + user selected skills
    const selectedSet = useMemo(() => {
        const combined = new Set<string>([...defaultSkillsSet]); //creamos un nuevo Set de string con las predeterminadas, utilizamos ... para convertirlo en array y guardarlo en combined
        userSelectedSet.forEach(val => combined.add(val));  // forEach para iterar por todos las skills userSelected y añadirlas a combined
        return combined;
    }, [defaultSkillsSet, userSelectedSet]); //El useMemo volvera a ejecutar esta logica solo si cambian el default o el UserSelected


    useEffect(() => {
        setUserSelectedSet(new Set(selected));
    }, [selected]);



    const toggleSkill = (skill: Skill) => {
        // evita deseleccionar skills predeterminadas
        if (defaultSkillsSet.has(skill.value)) return;

        //skill esta en userselected -> se puede quitar i poner
        const isSelected = userSelectedSet.has(skill.value);

        if (isSelected) {

            //updated -> copia del Set (conjunto skills) seleccionadas
            const updated = new Set(userSelectedSet);

            //Buscamos las habilidades requisito, por ejemplo, si deselecciono una habilidad T prereq de una M, quita la M tambien
            const toRemove = getDependents(skill.value, skills, selectedSet);
            toRemove.forEach(val => updated.delete(val));
            updated.delete(skill.value);

            //updateamos estado de userSelected -> le pasamos el set nuevo que creamos antes
            setUserSelectedSet(updated);
            setErrorMessage(null);

            //onChange-> notifica el cambio
            onChange(Array.from(updated));
        } else {
            //comprobamos que no se pase del maximo de habilidades
            if (userSelectedSet.size >= maxSelection) {
                setErrorMessage(`Máximo ${maxSelection} habilidades.`);
                return;
            }
            //Despues de todas las comprobaciones (not default skill, prerequisitos cumplidos) -> creamos nuevo userSelectedSet, actualizamos el valor de updated con la nueva skill
            //Limpiamos mensaje de error (si hubiera) y notificamos del cambio
            const updated = new Set(userSelectedSet);
            updated.add(skill.value);
            setUserSelectedSet(updated);
            setErrorMessage(null);
            onChange(Array.from(updated));
        }
    };
    //getDependents -> quitar una habilidad elimina tambien las que dependan de ella
    const getDependents = (value: string, allSkills: Skill[], current: Set<string>) => {
        const dependents = new Set<string>();
        const queue = [value];

        while (queue.length > 0) {
            const currentSkill = queue.pop()!; //mientras haya elementos en la cola seguimos pudiendo escoger
            for (const skill of allSkills) {
                //if -> La skill escogida debe 1) estar seleccionada 2) depender de currentSkill  3) NO haber sido procesada por esta misma funcion
                if (current.has(skill.value) && skill.prerq.includes(currentSkill) && !dependents.has(skill.value)) {
                    dependents.add(skill.value);
                    queue.push(skill.value);
                    {/** Basicamente -> "conectamos" las skills (hacemos una cola) de forma que A depende de B,
                        B depende de C, C no depende de nadie, seria nuestra habilidad de tier minimo.
                        Entonces, si quitamos C, automaticamente se quitan B y A    */}
                }
            }
        }
        return Array.from(dependents);
    };

    return (
        <div className="space-y-6">
            {errorMessage && (
                <div className="text-red-400 font-semibold bg- border border-red-500 p-2 rounded">
                    {errorMessage}
                </div>
            )}
            {TIERS.map((tier) => (
                <div key={tier}>
                    <h3 className="font-bold text-red-400 font-mono">Tier {tier}</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {skills
                            .filter((s) => s.tier === tier)
                            .map((skill) => {
                                //determinamos estado de la skill -> seleccionada/bloqueada/predeterminada
                                const isSelected = selectedSet.has(skill.value);
                                const hasAnyPrereq = skill.prerq.length === 0 || skill.prerq.some((pr) => selectedSet.has(pr)); //comprobacion de prerequisitos
                                const locked = !isSelected && skill.prerq.length > 0 && !hasAnyPrereq;
                                const isDefault = defaultSkillsSet.has(skill.value);

                                //este boton da mucho susto es muy feo pero simplemente colorea diferente si la habilidad es default/locked/selected
                                return (
                                    <button
                                        type="button"
                                        key={skill.value}
                                        onClick={() => !isDefault && toggleSkill(skill)}
                                        disabled={locked || isDefault}
                                        className={`p-2 border rounded text-left font-mono ${isDefault
                                            //color skill predeterminada
                                            ? 'bg-red-950 text-white border-black cursor-not-allowed'
                                            : isSelected
                                                //color skill seleccionada
                                                ? 'bg-red-600 text-white border-black'
                                                : locked
                                                    //color skill bloqueada / no seleccionada
                                                    ? 'bg-gray-800 text-gray-400 border-gray-500 cursor-not-allowed'
                                                    : 'bg-black text-white border-red-500'
                                            }`}
                                    >
                                        {skill.label}
                                    </button>
                                );
                            })}
                    </div>
                </div>
            ))}
        </div>
    );
}
