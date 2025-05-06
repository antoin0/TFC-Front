import { useState, useEffect } from 'react';

const TIERS = ['T', 'E', 'M'];

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
}

export default function SkillTreeSimplificado({ skills, selected, onChange, maxSelection }: Props) {
    const [selectedSet, setSelectedSet] = useState(new Set(selected));
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        setSelectedSet(new Set(selected));
    }, [selected]);

    const toggleSkill = (skill: Skill) => {
        const isSelected = selectedSet.has(skill.value);

        if (isSelected) {
            const updated = new Set(selectedSet);
            const toRemove = getDependents(skill.value, skills, selectedSet);
            toRemove.forEach((val) => updated.delete(val));
            updated.delete(skill.value);
            setSelectedSet(updated);
            setErrorMessage(null);
            onChange(Array.from(updated));
        } else {
            if (selectedSet.size >= maxSelection) {
                setErrorMessage(`Máximo ${maxSelection} habilidades.`);
                return;
            }

            const hasAnyPrereq = skill.prerq.length === 0 || skill.prerq.some((pr) => selectedSet.has(pr));
            if (!hasAnyPrereq) {
                setErrorMessage(`Requiere al menos uno de: ${skill.prerq.join(', ')}`);
                return;
            }

            const updated = new Set(selectedSet);
            updated.add(skill.value);
            setSelectedSet(updated);
            setErrorMessage(null);
            onChange(Array.from(updated));
        }
    };

    const getDependents = (value: string, allSkills: Skill[], current: Set<string>) => {
        const dependents = new Set<string>();
        const queue = [value];

        while (queue.length > 0) {
            const curr = queue.pop()!;
            for (const skill of allSkills) {
                if (current.has(skill.value) && skill.prerq.includes(curr) && !dependents.has(skill.value)) {
                    dependents.add(skill.value);
                    queue.push(skill.value);
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
                    <h3 className="font-bold text-red-400">Tier {tier}</h3>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        {skills
                            .filter((s) => s.tier === tier)
                            .map((skill) => {
                                const isSelected = selectedSet.has(skill.value);
                                const hasAnyPrereq = skill.prerq.length === 0 || skill.prerq.some((pr) => selectedSet.has(pr));
                                const locked = !isSelected && skill.prerq.length > 0 && !hasAnyPrereq;

                                return (
                                    <button type='button'
                                        key={skill.value}
                                        onClick={() => toggleSkill(skill)}
                                        disabled={locked}
                                        className={`p-2 border rounded text-left ${isSelected
                                            ? 'bg-red-700 text-white border-black'
                                            : locked
                                                ? 'bg-gray-800 text-gray-400 border-gray-500 cursor-not-allowed'
                                                : 'bg-black text-white border-red-500'
                                            }`}
                                        title={
                                            locked
                                                ? `Requiere al menos uno de: ${skill.prerq.join(', ')}`
                                                : ''
                                        }
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
