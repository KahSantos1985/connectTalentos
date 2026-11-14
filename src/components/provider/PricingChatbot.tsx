import React, { useState, useRef, useEffect, useCallback, forwardRef } from "react";
// Importações simuladas para o ambiente Canvas
// Corrigido: Tipagem de Props adicionada
const Button: React.FC<
  React.PropsWithChildren<{
    onClick?: any;
    disabled?: boolean;
    className?: string;
    color?: string;
    type?: "button" | "submit" | "reset";
  }>
> = ({ onClick, children, disabled = false, className = "", type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 font-semibold rounded-lg transition-all text-sm ${
      disabled
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : `bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95`
    } ${className}`}
  >
    {children}
  </button>
);

const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
  <input
    ref={ref}
    {...props}
    className="w-full p-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
  />
));

const Card: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={`bg-white shadow-xl rounded-xl p-0 ${className}`}>{children}</div>
);
const CardHeader: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <div className="bg-indigo-700 text-white p-4 rounded-t-xl">{children}</div>
);
const CardTitle: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <h2 className="text-xl font-bold">{children}</h2>
);
const CardDescription: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <p className="text-sm opacity-80">{children}</p>
);
const CardContent: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={`space-y-4 p-4 ${className}`}>{children}</div>
);

// Correção: Envolver com forwardRef para aceitar a prop ref
const ScrollArea = forwardRef<HTMLDivElement, React.PropsWithChildren<{ className?: string }>>(
  ({ children, className = "", ...props }, ref) => (
    <div ref={ref} className={`h-[400px] pr-4 overflow-y-auto ${className}`} {...props}>
      {children}
    </div>
  ),
);

const Loader2: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    className={`h-4 w-4 animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
    <path
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// Icons (Simulados)
const DollarSign: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);
const Clock: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
const Bot: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 8V4"></path>
    <rect x="2" y="4" width="20" height="12" rx="2"></rect>
    <path d="M2 16l20 0"></path>
    <path d="M6 20l12 0"></path>
  </svg>
);
const User: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);
const Send: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);
const CheckCircle: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14 9 11"></polyline>
  </svg>
);

// --- Definições de Tipos e Enumeração de Fases ---
enum Phase {
  SERVICE_NAME = 1, // Fase 1: Qual o produto que quer precificar?
  PRICE_TYPE = 2, // Fase 2: Preço por Hora ou Preço Fechado?
  DESIRED_PRICE = 3, // Fase 3: Preço desejado por unidade
  HOURS = 4, // Fase 4: Tempo médio em horas
  HOURLY_WAGE = 5, // Fase 5: Salário/Pró-Labore por hora
  MATERIAL_COST_BATCH = 6, // Fase 6: Custo total do lote de materiais
  UNITS_PER_BATCH = 7, // Fase 7: Quantas unidades por lote
  TRANSPORT = 8, // Fase 8: Custo médio com transporte
  TAX = 9, // Fase 9: Percentual de imposto
  PROFIT = 10, // Fase 10: Margem de lucro desejada
  RESULT = 11, // Resultado final

  // Antigos valores removidos: COSTS (4), COSTS_MATERIAL_COST (4.1), etc.
  DESCRIPTION_GENERATION = 12, // Nova fase para IA
}

interface Message {
  role: "user" | "assistant";
  content: string | JSX.Element;
  isError?: boolean;
}

interface PricingInputs {
  serviceName: string;
  priceType: "hour" | "fixed";
  desiredPrice: number | null;
  timeSpentHours: number | null;
  costMaterials: number | null;
  costTransport: number | null;
  hourlyWage: number | null;
  taxRate: number | null;
  profitMargin: number | null;
  materialCostBatch: number | null;
  unitsFromBatch: number | null;
}

const INITIAL_INPUTS: PricingInputs = {
  serviceName: "",
  priceType: "fixed",
  desiredPrice: null,
  timeSpentHours: null,
  costMaterials: null,
  costTransport: null,
  hourlyWage: null,
  taxRate: null,
  profitMargin: null,
  materialCostBatch: null,
  unitsFromBatch: null,
};

// --- FUNÇÕES DE CÁLCULO (INCLUÍDAS AQUI PARA RESOLVER O ERRO DE RESOLUÇÃO) ---

interface CalculateParams {
  hourlyWage: number;
  timeSpentHours: number;
  costMaterials: number; // Custo do material por unidade
  costTransport: number; // Custo total de transporte do lote
  unitsFromBatch: number; // quantidade de unidades no lote
  taxRate: number; // percentual de impostos (0 a 1)
  profitMargin: number; // margem de lucro desejada (0 a 1)
  desiredPrice: number; // preço de venda pretendido por unidade
}

interface SimulationParams {
  numLots: number;
  unitsFromBatch: number;
  unitPrice: number; // preço de venda unitário
  directCostPerUnit: number; // custo direto por unidade
  taxRate: number; // percentual de impostos (0 a 1)
  profitMargin: number; // percentual de lucro (0 a 1)
}

/**
 * Calcula o preço final sugerido e a viabilidade do preço desejado.
 */
export function calculateFinalPrice({
  hourlyWage = 0,
  timeSpentHours = 0,
  costMaterials = 0,
  costTransport = 0,
  unitsFromBatch = 1,
  taxRate = 0,
  profitMargin = 0,
  desiredPrice = 0,
}: CalculateParams) {
  // === 1. Custo Direto do Lote ===
  const laborCostLote = hourlyWage * timeSpentHours;
  const directCostLote = laborCostLote + costMaterials * unitsFromBatch + costTransport;
  const directCostPerUnit = directCostLote / unitsFromBatch; // Custo Variável Unitário

  // === 2. Custo Base Total por unidade ===
  const totalCostBasePerUnit = directCostPerUnit;

  // === 3. Cálculo do Preço Sugerido (Mark-up Customizado) ===
  // Preço Sugerido = [Custo Variável * (1 + Lucro Desejado)] / (1 - Imposto)
  const costWithProfit = totalCostBasePerUnit * (1 + profitMargin);
  const finalPrice = costWithProfit / (1 - taxRate);

  // === 4. Viabilidade comparando com preço desejado ===
  const totalTax = desiredPrice * taxRate;

  // Lucro Real é o que sobra APÓS pagar o Custo Base (Direto) e o Imposto
  const profitValue = desiredPrice - totalCostBasePerUnit - totalTax;

  // Lucro que deveria ter (Meta)
  const targetProfitValue = totalCostBasePerUnit * profitMargin;

  // Condição de viabilidade: O lucro real deve ser maior ou igual ao lucro desejado
  const isViable = profitValue >= targetProfitValue;

  const actualProfitPercentage = profitValue / desiredPrice; // Lucro percentual sobre o PREÇO DE VENDAS

  // === 5. Retorno ===
  return {
    directCostLote,
    directCostPerUnit,
    totalCostBasePerUnit: parseFloat(totalCostBasePerUnit.toFixed(2)), // Garante 2 casas decimais
    finalPrice: finalPrice,
    actualProfitPercentage: actualProfitPercentage,
    isViable: isViable,
    profitValue: profitValue,
    totalTax,
  };
}

/**
 * Simulação de produção/venda com múltiplos lotes.
 */
export function calculateMultiLotSimulation({
  numLots = 4,
  unitsFromBatch = 1,
  unitPrice = 0,
  directCostPerUnit = 0,
  taxRate = 0,
  profitMargin = 0, // ProfitMargin é usado para o cálculo do Lucro Presumido
}: SimulationParams) {
  const simulation = [];

  for (let i = 1; i <= numLots; i++) {
    const totalUnits = i * unitsFromBatch;
    const revenue = totalUnits * unitPrice;
    const totalVariableCost = totalUnits * directCostPerUnit;
    const totalTax = revenue * taxRate;

    // Lucro Presumido: Faturamento total - Custo Variável Total (Conforme pedido)
    const profitPresumido = revenue - totalVariableCost;

    // Arredondamento seguro para evitar o erro de ponto flutuante
    const roundedProfitPresumido = parseFloat(profitPresumido.toFixed(2));

    // Adiciona tratamento para NaN/Infinity, assumindo 0 se o preço for zero.
    if (unitPrice === 0 || isNaN(revenue) || !isFinite(revenue)) {
      simulation.push({
        lote: i,
        unidades: totalUnits,
        unitPrice: unitPrice,
        faturamento: 0,
        lucroPresumido: 0,
        totalVariableCost: 0,
      });
      continue;
    }

    simulation.push({
      lote: i,
      unidades: totalUnits,
      unitPrice: unitPrice,
      faturamento: revenue,
      custoTotal: totalVariableCost + revenue * taxRate, // Custo Total (Variável + Imposto)
      lucroPresumido: roundedProfitPresumido, // Lucro Presumido = Faturamento - Custo Variável Total
      totalVariableCost: totalVariableCost,
    });
  }
  return simulation;
}

// Simulação de Backend para dados de mercado (Mock)
interface MarketData {
  avgIncome: number;
  competitorPriceAvg: number;
  localCompetitorsCount: number;
}

export const fetchMarketIntelligence = (): Promise<MarketData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ avgIncome: 2800, competitorPriceAvg: 45, localCompetitorsCount: 12 });
    }, 500);
  });
};

// --- Componente Principal ---
const PricingChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Olá! Sou o Assistente de Preços, baseado na metodologia Sebrae. Vou te guiar em 5 passos para precificar seu serviço de forma inteligente. Qual o produto que quer precificar?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phase, setPhase] = useState<Phase>(Phase.SERVICE_NAME);
  const [inputs, setInputs] = useState<PricingInputs>(INITIAL_INPUTS);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [calculationResult, setCalculationResult] = useState<any>(null);

  // Simulação do useToast
  const toast = ({ title, description, variant }: { title: string; description: string; variant: string }) => {
    console.log(`TOAST: [${variant}] ${title} - ${description}`);
  };

  // --- UTILS ---
  const formatCurrency = useCallback((value: number | null): string => {
    if (value === null || isNaN(value) || !isFinite(value)) return "R$ 0,00";
    return `R$ ${value.toFixed(2).replace(".", ",")}`;
  }, []);

  const parseInput = (value: string): number | null => {
    const cleaned = value.replace(",", ".").trim();
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  };

  const addMessage = useCallback(
    (role: "user" | "assistant", content: string | JSX.Element, isError: boolean = false) => {
      setMessages((prev) => [...prev, { role, content, isError }]);
    },
    [],
  );

  const handleNextPhase = useCallback(
    (nextPhase: Phase, botMessage: string | JSX.Element) => {
      setIsLoading(true);
      setTimeout(() => {
        addMessage("assistant", botMessage);
        setPhase(nextPhase);
        setIsLoading(false);
      }, 700);
    },
    [addMessage],
  );

  // --- VALIDAÇÃO E CONVERSÃO DE INPUTS ---
  const validateNumber = (
    val: string,
    field: keyof PricingInputs,
    min: number = 0,
    isPercentage: boolean = false,
  ): number | null => {
    let cleanedVal = val.replace(",", ".").trim();
    let num: number | null = parseInput(cleanedVal);

    const numberRegex = /^-?\s*(\d+([.,]\d*)?|[.,]\d+)\s*[%]?\s*$/;

    if (!numberRegex.test(val)) {
      addMessage(
        "assistant",
        "Ops! Este campo só aceita valores numéricos (use ponto ou vírgula para decimais).",
        true,
      );
      return null;
    }

    if (num === null || isNaN(num) || num < min) {
      addMessage("assistant", `Ops! O valor inserido não é válido. Por favor, insira um número válido.`, true);
      return null;
    }

    if (isPercentage) {
      let finalRate = num;
      if (cleanedVal.includes("%") || (num > 1 && num <= 100)) {
        finalRate = finalRate / 100;
      }

      if (finalRate < 0 || finalRate > 1) {
        addMessage("assistant", `Ops! O percentual deve estar entre 0 e 100%.`, true);
        return null;
      }
      return finalRate; // Retorna o valor entre 0 e 1
    }
    return num;
  };

  // --- FUNÇÃO GEMINI PARA GERAR DESCRIÇÃO ---
  const handleGenerateDescription = useCallback(
    async (serviceName: string, finalPrice: number, marketAvg: number) => {
      setIsLoading(true);
      addMessage("assistant", `✨ Gerando descrição profissional para "${serviceName}"...`, false);

      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

      const marketComparison =
        finalPrice > marketAvg
          ? `O preço sugerido de ${formatCurrency(finalPrice)} é superior à média de mercado (${formatCurrency(marketAvg)}). Destaque a qualidade e os diferenciais.`
          : `O preço sugerido de ${formatCurrency(finalPrice)} está abaixo ou próximo à média de mercado (${formatCurrency(marketAvg)}). Destaque o custo-benefício.`;

      const userQuery = `Crie uma descrição de marketing profissional e atraente para o serviço de ${serviceName}. A descrição deve ter cerca de 4 parágrafos curtos, ser persuasiva e focar no valor para o cliente. Inclua um título. ${marketComparison}. Não mencione a IA ou o Sebrae.`;

      const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: {
          parts: [
            {
              text: "Você é um especialista em copywriter focado em marketing de serviços locais, usando linguagem amigável e persuasiva.",
            },
          ],
        },
      };

      let assistantMessage = "";

      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error(`API returned status ${response.status}`);
          }

          const result = await response.json();
          const text =
            result.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Não foi possível gerar a descrição. Tente novamente mais tarde.";
          assistantMessage = text;
          break;
        } catch (error) {
          console.error(`Attempt ${attempt + 1} failed:`, error);
          if (attempt === 4) {
            assistantMessage =
              "Lamentamos, mas a geração de IA falhou após várias tentativas. Verifique a sua ligação à internet ou tente reiniciar o cálculo.";
          }
          // Implementação de espera exponencial (1s, 2s, 4s, 8s, 16s)
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise((res) => setTimeout(res, delay));
        }
      }

      const finalContent = (
        <div className="p-4 border border-indigo-500 bg-indigo-50 rounded-lg">
          <h4 className="font-bold text-indigo-800">✅ Descrição Gerada por IA:</h4>
          <p className="text-sm whitespace-pre-wrap mt-2 text-gray-700">{assistantMessage}</p>
        </div>
      );

      addMessage("assistant", finalContent, false);
      setPhase(Phase.RESULT); // Retorna à fase RESULT
      setIsLoading(false);
    },
    [addMessage, formatCurrency],
  );

  // --- FLUXO DE CÁLCULO FINAL ---
  const handleCalculateResult = useCallback(async () => {
    setIsLoading(true);
    addMessage("assistant", "Aguarde um momento enquanto cruzo seus dados com a Inteligência de Mercado...");

    const marketData = await fetchMarketIntelligence(); // Simulação de busca de dados

    const result = calculateFinalPrice({
      hourlyWage: inputs.hourlyWage || 0,
      timeSpentHours: inputs.timeSpentHours || 0,
      costMaterials: inputs.costMaterials || 0,
      costTransport: inputs.costTransport || 0,
      unitsFromBatch: inputs.unitsFromBatch || 1,
      taxRate: inputs.taxRate || 0,
      profitMargin: inputs.profitMargin || 0,
      desiredPrice: inputs.desiredPrice || 0,
    });

    const simulationData = calculateMultiLotSimulation({
      numLots: 4,
      unitsFromBatch: inputs.unitsFromBatch || 1,
      unitPrice: inputs.desiredPrice || result.finalPrice,
      directCostPerUnit: result.directCostPerUnit,
      taxRate: inputs.taxRate || 0,
      profitMargin: inputs.profitMargin || 0,
    });

    // Armazena o resultado para exibir no dialog
    setCalculationResult({
      result,
      simulationData,
      marketData,
      inputs: { ...inputs }
    });

    setIsLoading(false);
    setShowResultDialog(true);
  }, [inputs, formatCurrency]);

  // --- SUBMIT PRINCIPAL ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userInput = input.trim();

    let nextPhase: Phase = phase;
    let nextMessage: string | JSX.Element = "";
    let valid = true;
    let numericValue: number | null = null;

    switch (phase) {
      case Phase.SERVICE_NAME:
        setInputs((prev) => ({ ...prev, serviceName: userInput, priceType: "fixed" }));
        nextPhase = Phase.DESIRED_PRICE;
        nextMessage =
          "Ótimo. Para referência, qual é o preço por unidade/serviço que você gostaria de cobrar? (Ex: 25.00)";
        addMessage("user", userInput);
        handleNextPhase(nextPhase, nextMessage);
        setInput("");
        return;

      case Phase.PRICE_TYPE:
        addMessage(
          "assistant",
          'Por favor, clique em uma das opções acima: "Preço por Hora" ou "Preço Fechado".',
          true,
        );
        return;

      case Phase.DESIRED_PRICE:
        numericValue = validateNumber(userInput, "desiredPrice", 0.01);
        if (numericValue !== null) {
          setInputs((prev) => ({ ...prev, desiredPrice: numericValue }));
          nextPhase = Phase.HOURS;
          const typeLabel = inputs.priceType === "hour" ? "sua hora de trabalho" : "o serviço completo";
          nextMessage = `Entendido. Agora vamos aos custos. Qual é o tempo médio (em horas) que você leva para ${typeLabel}? (Ex: 3)`;
        } else {
          valid = false;
        }
        break;

      case Phase.HOURS:
        numericValue = validateNumber(userInput, "timeSpentHours", 0.01);
        if (numericValue !== null) {
          setInputs((prev) => ({ ...prev, timeSpentHours: numericValue }));
          nextPhase = Phase.HOURLY_WAGE;
          nextMessage = `Passo 1: Custos Diretos. Quanto você quer ganhar por **cada hora** de trabalho que você dedica? (É o seu salário/pró-labore por hora). (Ex: 80.00)`;
        } else {
          valid = false;
        }
        break;

      case Phase.HOURLY_WAGE:
        numericValue = validateNumber(userInput, "hourlyWage", 0.01);
        if (numericValue !== null) {
          setInputs((prev) => ({ ...prev, hourlyWage: numericValue }));
          nextPhase = Phase.MATERIAL_COST_BATCH;
          nextMessage =
            "Qual o custo total dos materiais ou insumos que você compra para fazer este serviço (pode ser o valor de um lote)? (Ex: R$ 90.00)";
        } else {
          valid = false;
        }
        break;

      case Phase.MATERIAL_COST_BATCH:
        numericValue = validateNumber(userInput, "materialCostBatch", 0);
        if (numericValue !== null) {
          setInputs((prev) => ({ ...prev, materialCostBatch: numericValue }));
          nextPhase = Phase.UNITS_PER_BATCH;
          nextMessage = `Com esse custo total de ${formatCurrency(numericValue)}, quantas **unidades/serviços** (Ex: "bolos de pote") você consegue produzir?`;
        } else {
          valid = false;
        }
        break;

      case Phase.UNITS_PER_BATCH:
        numericValue = validateNumber(userInput, "unitsFromBatch", 1);
        if (numericValue !== null && inputs.materialCostBatch !== null) {
          const calculatedCostPerUnit = inputs.materialCostBatch / numericValue;

          setInputs((prev) => ({
            ...prev,
            unitsFromBatch: numericValue,
            costMaterials: calculatedCostPerUnit,
          }));

          nextPhase = Phase.TRANSPORT;
          nextMessage = `Perfeito! O custo de material por serviço é ${formatCurrency(calculatedCostPerUnit)}. Agora, qual o custo médio que você gasta com **transporte** (passagens/gasolina) para realizar este serviço? (Ex: 25.00)`;
        } else {
          valid = false;
          if (numericValue === null) {
            // A função validateNumber já adiciona a mensagem de erro.
          }
        }
        break;

      case Phase.TRANSPORT:
        numericValue = validateNumber(userInput, "costTransport", 0);
        if (numericValue !== null) {
          setInputs((prev) => ({ ...prev, costTransport: numericValue }));
          nextPhase = Phase.TAX;
          nextMessage =
            "Passo 2: Impostos. Qual o **percentual de imposto** (DAS/Simples) que você paga sobre o valor de venda? (Digite o número, ex: 5% = 5)";
        } else {
          valid = false;
        }
        break;

      case Phase.TAX:
        numericValue = validateNumber(userInput, "taxRate", 0, true);
        if (numericValue !== null) {
          // Validação adicional: imposto deve ser menor que 100%
          if (numericValue >= 1) {
            addMessage(
              "assistant",
              "⚠️ O percentual de imposto não pode ser 100% ou mais. Por favor, insira um valor menor que 100%.",
              true
            );
            valid = false;
          } else {
            setInputs((prev) => ({ ...prev, taxRate: numericValue }));
            nextPhase = Phase.PROFIT;
            nextMessage =
              "Passo 3: Lucro. Para fechar, qual a **margem de lucro** (em percentual, 0-100) que você quer ter com este serviço? (Ex: 20)";
          }
        } else {
          valid = false;
        }
        break;

      case Phase.PROFIT:
        numericValue = validateNumber(userInput, "profitMargin", 0, true);
        if (numericValue !== null) {
          setInputs((prev) => ({ ...prev, profitMargin: numericValue }));
          
          addMessage("user", userInput);
          setInput("");
          setPhase(Phase.RESULT);
          
          // Chama handleCalculateResult automaticamente após um pequeno delay
          setTimeout(() => {
            handleCalculateResult();
          }, 500);
          return;
        } else {
          valid = false;
        }
        break;

      case Phase.RESULT:
      case Phase.DESCRIPTION_GENERATION:
        // Se o usuário tentar digitar após o resultado, pode-se reiniciar
        if (userInput.toLowerCase() === "reiniciar" || userInput.toLowerCase() === "recomeçar") {
          setMessages([{ role: "assistant", content: "Reiniciando. Qual produto ou serviço você deseja precificar?" }]);
          setInputs(INITIAL_INPUTS);
          setPhase(Phase.SERVICE_NAME);
          setInput("");
          return;
        }
        addMessage("assistant", 'Cálculo concluído. Digite "Reiniciar" para começar um novo cálculo.');
        return;
    }

    if (valid) {
      if (phase !== Phase.PROFIT) {
        addMessage("user", userInput);
      }

      handleNextPhase(nextPhase, nextMessage);
      setInput("");
    }
  };

  const handlePriceTypeSelection = useCallback(
    (type: "hour" | "fixed", label: string) => {
      addMessage("user", label);
      setInputs((prev) => ({ ...prev, priceType: type }));

      // Próxima fase: DESIRED_PRICE
      const nextMessage =
        "Ótimo. Para referência, qual é o preço por unidade/serviço que você *gostaria* de cobrar? (Ex: 25.00)";
      handleNextPhase(Phase.DESIRED_PRICE, nextMessage);
    },
    [addMessage, handleNextPhase],
  );

  // Garante que o scroll desça automaticamente e o input fique visível
  useEffect(() => {
    // Scroll na área de mensagens - sempre prioriza mostrar as mensagens
    setTimeout(() => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: "smooth" });
      }
    }, 150);
    
    // Foca no input apenas quando NÃO estiver na fase de RESULT ou DESCRIPTION_GENERATION
    setTimeout(() => {
      if (inputRef.current && phase !== Phase.RESULT && phase !== Phase.DESCRIPTION_GENERATION && phase !== Phase.PRICE_TYPE && !isLoading) {
        inputRef.current.focus();
      }
    }, 200);
  }, [messages, phase, isLoading]);

  return (
    <Card className="max-w-4xl mx-auto h-[600px] flex flex-col p-0">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-700/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <DollarSign className="h-5 w-5 text-indigo-700" />
          </div>
          <div className="flex-1">
            <CardTitle>Assistente de Precificação (Metodologia SEBRAE)</CardTitle>
            <CardDescription>
              Orientação especializada para precificar seus serviços de forma inteligente
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col">
        {/* Área de Mensagens */}
        <ScrollArea className="h-[400px] pr-4 flex-1" ref={scrollAreaRef}>
          <div className="space-y-4 pr-2">
            {messages.map((message, index) => (
              <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-indigo-700/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-indigo-700" />
                  </div>
                )}
                <div
                  className={`rounded-xl px-4 py-3 max-w-[80%] shadow-md ${
                    message.role === "user"
                      ? "bg-indigo-500 text-white rounded-br-none"
                      : message.isError
                        ? "bg-red-100 text-red-700 rounded-bl-none border border-red-300 font-semibold"
                        : "bg-white text-gray-800 rounded-bl-none"
                  }`}
                >
                  {typeof message.content === "string" ? (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <div className="text-sm">{message.content}</div>
                  )}
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && phase !== Phase.RESULT && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-indigo-700/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-indigo-700" />
                </div>
                <div className="rounded-xl px-4 py-3 bg-white">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                </div>
              </div>
            )}

          </div>
        </ScrollArea>

        {showResultDialog && calculationResult && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-green-700 text-white p-6 rounded-t-xl flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <CheckCircle className="w-6 h-6" />
                    Resultado da Precificação
                  </h2>
                  <p className="text-green-100 text-sm mt-1">
                    {calculationResult.inputs.priceType === "hour" ? "Preço por Hora" : "Preço Fechado"}
                  </p>
                </div>
                <button
                  onClick={() => setShowResultDialog(false)}
                  className="text-white hover:bg-green-600 rounded-full p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Análise de Viabilidade */}
                {(() => {
                  const { result, inputs: resultInputs } = calculationResult;
                  const desiredPriceDisplay = formatCurrency(resultInputs.desiredPrice);
                  const actualProfit = (result.actualProfitPercentage * 100).toFixed(1);
                  const lossOrLowProfit = result.profitValue;

                  if (result.isViable) {
                    return (
                      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                        <p className="text-green-800 font-semibold">
                          ✅ Análise do Preço Desejado ({desiredPriceDisplay}): <strong>SIM, é viável!</strong> Com {desiredPriceDisplay} você atinge a
                          margem desejada e ainda sobra um lucro real de <strong>{actualProfit}%</strong>.
                        </p>
                      </div>
                    );
                  } else if (lossOrLowProfit > 0) {
                    return (
                      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800 font-semibold">
                          ⚠️ Análise do Preço Desejado ({desiredPriceDisplay}): <strong>COBRE OS CUSTOS.</strong> Seu lucro real será de apenas <strong>
                          {actualProfit}%</strong>, não atingindo a margem desejada.
                        </p>
                      </div>
                    );
                  } else {
                    return (
                      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                        <p className="text-red-800 font-semibold">
                          ❌ Análise do Preço Desejado ({desiredPriceDisplay}): <strong>PREJUÍZO GARANTIDO.</strong> Você terá um prejuízo de <strong>
                          {formatCurrency(Math.abs(lossOrLowProfit))}</strong> por unidade.
                        </p>
                      </div>
                    );
                  }
                })()}

                {/* Custo Total Base */}
                <div className="bg-yellow-50 p-4 rounded-lg shadow-sm border-2 border-yellow-200">
                  <p className="text-sm font-semibold text-yellow-800">Custo Total Base (Valor Bruto / Sem Lucro e Impostos)</p>
                  <p className="text-3xl font-bold text-yellow-900 mt-2">{formatCurrency(calculationResult.result.totalCostBasePerUnit)}</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    (Este é o preço mínimo para não ter prejuízo no custo variável.)
                  </p>
                </div>

                {/* Preço de Venda Sugerido */}
                <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-green-200">
                  <p className="text-sm font-semibold text-gray-600">Preço de Venda Sugerido (Com Lucro e Impostos)</p>
                  <p className="text-4xl font-extrabold text-green-900 mt-2">{formatCurrency(calculationResult.result.finalPrice)}</p>
                </div>

                {/* Botão de Geração de IA */}
                <div className="pt-2 border-t-2 border-gray-200">
                  <Button
                    onClick={() => {
                      setShowResultDialog(false);
                      handleGenerateDescription(
                        calculationResult.inputs.serviceName,
                        calculationResult.result.finalPrice,
                        calculationResult.marketData.competitorPriceAvg
                      );
                    }}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 !text-white font-bold py-4"
                    disabled={isLoading}
                  >
                    ✨ Gerar Descrição de Marketing com IA
                  </Button>
                </div>

                {/* Simulação de Lotes */}
                <div className="pt-4 border-t-2 border-gray-200">
                  <h4 className="font-semibold text-gray-800 text-lg mb-2">Simulação de Lotes (Produção Múltipla):</h4>
                  <p className="text-xs text-red-600 mb-3">
                    ⚠️ Atenção: Esta simulação <strong>não inclui</strong> suas despesas fixas mensais.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="px-3 py-2 text-xs font-medium text-gray-600 uppercase">Lote</th>
                          <th className="px-3 py-2 text-xs font-medium text-gray-600 uppercase">Unidades</th>
                          <th className="px-3 py-2 text-xs font-medium text-gray-600 uppercase">Preço Unidade</th>
                          <th className="px-3 py-2 text-xs font-medium text-gray-600 uppercase">Faturamento</th>
                          <th className="px-3 py-2 text-xs font-medium text-gray-600 uppercase">Custo Variável</th>
                          <th className="px-3 py-2 text-xs font-medium text-gray-600 uppercase">Lucro Presumido</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {calculationResult.simulationData.map((data: any) => (
                          <tr key={data.lote} className={data.lucroPresumido < 0 ? "bg-red-50" : ""}>
                            <td className="px-3 py-2 text-sm font-medium text-gray-900">{data.lote}</td>
                            <td className="px-3 py-2 text-sm text-gray-600">{data.unidades}</td>
                            <td className="px-3 py-2 text-sm text-gray-600">{formatCurrency(data.unitPrice)}</td>
                            <td className="px-3 py-2 text-sm text-gray-900 font-medium">{formatCurrency(data.faturamento)}</td>
                            <td className="px-3 py-2 text-sm text-gray-600">{formatCurrency(data.totalVariableCost)}</td>
                            <td className="px-3 py-2 text-sm font-bold text-gray-900">{formatCurrency(data.lucroPresumido)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Inteligência de Mercado */}
                <div className="pt-4 border-t-2 border-gray-200">
                  <h4 className="font-semibold text-gray-800 text-lg mb-2">📊 Inteligência de Mercado:</h4>
                  <div className="space-y-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-700">
                      <strong>Preço Médio Concorrente</strong> ({calculationResult.marketData.localCompetitorsCount} no seu raio): {formatCurrency(calculationResult.marketData.competitorPriceAvg)}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Renda Média Local (IBGE):</strong> {formatCurrency(calculationResult.marketData.avgIncome)}
                    </p>
                  </div>
                </div>

                {/* Botão Fechar */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    onClick={() => {
                      setMessages([{ role: "assistant", content: "Reiniciando. Qual produto ou serviço você deseja precificar?" }]);
                      setInputs(INITIAL_INPUTS);
                      setPhase(Phase.SERVICE_NAME);
                      setShowResultDialog(false);
                      setCalculationResult(null);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 !text-white"
                  >
                    🔄 Novo Cálculo
                  </Button>
                  <Button
                    onClick={() => setShowResultDialog(false)}
                    className="bg-green-600 hover:bg-green-700 !text-white"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Formulário de Input */}
        <form onSubmit={handleSubmit} className="border-t pt-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              type={"text"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSubmit(e);
              }}
              placeholder={phase === Phase.SERVICE_NAME ? "Ex: Bolo de Pote" : "Insira o valor (use ponto ou vírgula)"}
              disabled={phase === Phase.RESULT || isLoading || phase === Phase.PRICE_TYPE}
              className="flex-1"
            />
            <Button
              type="submit"
              onClick={() => {}}
              disabled={isLoading || !input.trim() || phase === Phase.PRICE_TYPE}
            >
              {isLoading ? <Loader2 className="h-5 w-5" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
          {phase === Phase.PRICE_TYPE && (
            <p className="mt-2 text-center text-sm text-gray-500">Aguardando a sua escolha acima.</p>
          )}
        </form>

        {/* Rodapé de Dicas */}
        <div className="bg-indigo-700/5 rounded-lg p-3 space-y-1">
          <p className="text-xs text-indigo-800">
            <CheckCircle className="inline h-3 w-3 mr-1" />
            <strong>Metodologia SEBRAE:</strong> Cálculo baseado em Custos Variáveis + Mark-up (Lucro + Impostos).
          </p>
          <p className="text-xs text-indigo-800">
            💡 <strong>Dica:</strong> Use ponto ou vírgula para decimais (ex: 25.50 ou 25,50).
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
export default PricingChatbot;
