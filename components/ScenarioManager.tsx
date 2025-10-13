'use client';
import { useState, useEffect } from 'react';
import { useFormulaStore } from '@/lib/state/store';
import type { FormulaMeta } from '@/lib/types/variable';
import { getFormulaMeta } from '@/lib/meta/formula-meta';

type Scenario = {
  id: string;
  name: string;
  description: string;
  formulaId: string;
  values: Record<string, number>;
  createdAt: Date;
  isBuiltIn?: boolean;
};

type Props = {
  className?: string;
};

export default function ScenarioManager({ className }: Props) {
  const { formulaId, vars, setMany, formulaMeta } = useFormulaStore();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newScenario, setNewScenario] = useState({
    name: '',
    description: ''
  });
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);

  // Carrega cenários do localStorage
  useEffect(() => {
    const savedScenarios = localStorage.getItem('polycalc-scenarios');
    if (savedScenarios) {
      try {
        const parsed = JSON.parse(savedScenarios);
        setScenarios(parsed.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt)
        })));
      } catch (error) {
        console.error('Erro ao carregar cenários:', error);
      }
    }

    // Carrega cenários pré-definidos da fórmula atual
    if (formulaMeta?.aiScenarios) {
      const builtInScenarios: Scenario[] = formulaMeta.aiScenarios.map((scenario, index) => ({
        id: `builtin-${formulaId}-${index}`,
        name: scenario.name,
        description: scenario.description,
        formulaId,
        values: scenario.values,
        createdAt: new Date(),
        isBuiltIn: true
      }));
      
      setScenarios(prev => {
        const existingBuiltIn = prev.filter(s => !s.isBuiltIn || s.formulaId !== formulaId);
        return [...existingBuiltIn, ...builtInScenarios];
      });
    }
  }, [formulaId, formulaMeta]);

  // Salva cenários no localStorage
  useEffect(() => {
    if (scenarios.length > 0) {
      localStorage.setItem('polycalc-scenarios', JSON.stringify(scenarios));
    }
  }, [scenarios]);

  const handleCreateScenario = () => {
    if (!newScenario.name.trim()) return;

    const scenario: Scenario = {
      id: `custom-${Date.now()}`,
      name: newScenario.name,
      description: newScenario.description,
      formulaId,
      values: { ...vars },
      createdAt: new Date()
    };

    setScenarios(prev => [...prev, scenario]);
    setNewScenario({ name: '', description: '' });
    setShowCreateForm(false);
  };

  const handleApplyScenario = (scenario: Scenario) => {
    setMany(scenario.values);
    setSelectedScenarioId(scenario.id);
  };

  const handleDeleteScenario = (scenarioId: string) => {
    setScenarios(prev => prev.filter(s => s.id !== scenarioId));
    if (selectedScenarioId === scenarioId) {
      setSelectedScenarioId(null);
    }
  };

  const handleCompareWithCurrent = (scenario: Scenario) => {
    const differences: Array<{
      variable: string;
      current: number;
      scenario: number;
      meta: any;
    }> = [];

    if (formulaMeta) {
      Object.entries(scenario.values).forEach(([varId, value]) => {
        if (vars[varId] !== undefined && vars[varId] !== value) {
          differences.push({
            variable: varId,
            current: vars[varId],
            scenario: value,
            meta: formulaMeta.variables[varId]
          });
        }
      });
    }

    if (differences.length === 0) {
      alert('Os valores são idênticos aos atuais!');
      return;
    }

    const diffText = differences.map(diff => 
      `${diff.meta?.name || diff.variable}: ${diff.current.toFixed(2)} → ${diff.scenario.toFixed(2)}`
    ).join('\n');

    alert(`Diferenças:\n${diffText}`);
  };

  // Filtra cenários da fórmula atual
  const currentFormulaScenarios = scenarios.filter(s => s.formulaId === formulaId);

  if (!formulaMeta) return null;

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className || ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Cenários</h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Novo Cenário
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-200">
          <input
            type="text"
            placeholder="Nome do cenário"
            value={newScenario.name}
            onChange={(e) => setNewScenario(prev => ({ ...prev, name: e.target.value }))}
            className="w-full mb-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <textarea
            placeholder="Descrição (opcional)"
            value={newScenario.description}
            onChange={(e) => setNewScenario(prev => ({ ...prev, description: e.target.value }))}
            className="w-full mb-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateScenario}
              disabled={!newScenario.name.trim()}
              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Salvar
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false);
                setNewScenario({ name: '', description: '' });
              }}
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {currentFormulaScenarios.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            Nenhum cenário salvo para esta fórmula. Crie um novo cenário para começar!
          </p>
        ) : (
          currentFormulaScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`p-3 border rounded-lg transition-colors ${
                selectedScenarioId === scenario.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900">{scenario.name}</h4>
                    {scenario.isBuiltIn && (
                      <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
                        Pré-definido
                      </span>
                    )}
                  </div>
                  {scenario.description && (
                    <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                  )}
                  <div className="text-xs text-gray-400 mt-2">
                    {scenario.createdAt.toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() => handleApplyScenario(scenario)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    title="Aplicar cenário"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => handleCompareWithCurrent(scenario)}
                    className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="Comparar com valores atuais"
                  >
                    ⚖
                  </button>
                  {!scenario.isBuiltIn && (
                    <button
                      onClick={() => handleDeleteScenario(scenario.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                      title="Excluir cenário"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedScenarioId && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <button
            onClick={() => {
              setMany(scenarios.find(s => s.id === selectedScenarioId)?.values || {});
            }}
            className="w-full px-3 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Reaplicar Cenário Selecionado
          </button>
        </div>
      )}
    </div>
  );
}