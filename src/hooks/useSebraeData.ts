import { useState, useEffect } from 'react';

export interface SebraeYearData {
  year: number;
  ageDistribution: {
    '0-25': number;
    '25-35': number;
    '35-45': number;
    '45-55': number;
    '55-65': number;
    '65+': number;
  };
  totalEntrepreneurs: number;
  householdPosition: {
    head: number;
    spouse: number;
    child: number;
    other: number;
  };
  education: {
    incomplete: number;
    complete: number;
    highSchool: number;
    college: number;
  };
  occupation: {
    selfEmployed: number;
    employer: number;
  };
  workload: {
    '0-14h': number;
    '15-39h': number;
    '40-44h': number;
    '45-48h': number;
    '49h+': number;
  };
  income: {
    '0-2SM': number;
    '2-5SM': number;
    '5+SM': number;
  };
  sectors: {
    agribusiness: number;
    commerce: number;
    construction: number;
    industry: number;
    services: number;
  };
  tenure: {
    '2y+': number;
    '1-2y': number;
    '1m-1y': number;
    '<1m': number;
  };
  gender: {
    male: number;
    female: number;
  };
}

const parsePercentage = (value: string): number => {
  if (!value || value.trim() === '') return 0;
  const cleaned = value.replace('%', '').replace(',', '.').trim();
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

const parseNumber = (value: string): number => {
  if (!value || value.trim() === '') return 0;
  const cleaned = value.replace(/\./g, '').trim();
  const parsed = parseInt(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

const parseCsvData = (text: string): Record<number, Record<string, string>> => {
  const lines = text.split('\n').filter(line => line.trim());
  if (lines.length < 2) return {};
  
  const headers = lines[0].split(',').map(h => h.trim());
  const data: Record<number, Record<string, string>> = {};
  
  for (let i = 1; i < lines.length; i++) {
    // Handle CSV with quoted fields
    const regex = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/;
    const values = lines[i].split(regex).map(v => v.replace(/^"|"$/g, '').trim());
    
    const year = parseInt(values[0]);
    if (isNaN(year)) continue;
    
    data[year] = {};
    for (let j = 1; j < headers.length && j < values.length; j++) {
      data[year][headers[j]] = values[j];
    }
  }
  
  return data;
};

export const useSebraeData = () => {
  const [data, setData] = useState<SebraeYearData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all CSV files in parallel
        const [
          totalResponse,
          ageResponse,
          householdResponse,
          educationResponse,
          workloadResponse,
          incomeResponse,
          sectorsResponse,
          genderResponse
        ] = await Promise.all([
          fetch('/data/sebrae-entrepreneurs-total.csv'),
          fetch('/data/sebrae-age.csv'),
          fetch('/data/sebrae-household-position.csv'),
          fetch('/data/sebrae-education.csv'),
          fetch('/data/sebrae-workload.csv'),
          fetch('/data/sebrae-income.csv'),
          fetch('/data/sebrae-sectors.csv'),
          fetch('/data/sebrae-gender.csv')
        ]);

        const [
          totalText,
          ageText,
          householdText,
          educationText,
          workloadText,
          incomeText,
          sectorsText,
          genderText
        ] = await Promise.all([
          totalResponse.text(),
          ageResponse.text(),
          householdResponse.text(),
          educationResponse.text(),
          workloadResponse.text(),
          incomeResponse.text(),
          sectorsResponse.text(),
          genderResponse.text()
        ]);

        // Parse all CSV data
        const totalData = parseCsvData(totalText);
        const ageData = parseCsvData(ageText);
        const householdData = parseCsvData(householdText);
        const educationData = parseCsvData(educationText);
        const workloadData = parseCsvData(workloadText);
        const incomeData = parseCsvData(incomeText);
        const sectorsData = parseCsvData(sectorsText);
        const genderData = parseCsvData(genderText);

        // Get all years from totalData
        const years = Object.keys(totalData).map(y => parseInt(y)).sort((a, b) => b - a);

        const parsedData: SebraeYearData[] = years.map(year => {
          const age = ageData[year] || {};
          const household = householdData[year] || {};
          const education = educationData[year] || {};
          const workload = workloadData[year] || {};
          const income = incomeData[year] || {};
          const sectors = sectorsData[year] || {};
          const gender = genderData[year] || {};

          return {
            year,
            totalEntrepreneurs: parseNumber(totalData[year]['Empreendedores'] || '0'),
            ageDistribution: {
              '0-25': parsePercentage(age['De 0 até 25 anos'] || '0'),
              '25-35': parsePercentage(age['De 25 até 35 anos'] || '0'),
              '35-45': parsePercentage(age['De 35 até 45 anos'] || '0'),
              '45-55': parsePercentage(age['De 45 até 55 anos'] || '0'),
              '55-65': parsePercentage(age['De 55 até 65 anos'] || '0'),
              '65+': parsePercentage(age['De 65 a mais'] || '0'),
            },
            householdPosition: {
              head: parsePercentage(household['Chefe de Domicílio'] || '0'),
              spouse: parsePercentage(household['Cônjuge'] || '0'),
              child: parsePercentage(household['Filho(a)'] || '0'),
              other: parsePercentage(household['Outros'] || '0'),
            },
            education: {
              incomplete: parsePercentage(education['Até Fundamental incompleto'] || '0'),
              complete: parsePercentage(education['Fundamental completo'] || '0'),
              highSchool: parsePercentage(education['Médio completo'] || '0'),
              college: parsePercentage(education['Superior completo'] || '0'),
            },
            occupation: {
              selfEmployed: 85.69, // Default values since not in new CSVs
              employer: 14.31,
            },
            workload: {
              '0-14h': parsePercentage(workload['00 a 14 horas'] || '0'),
              '15-39h': parsePercentage(workload['15 a 39 horas'] || '0'),
              '40-44h': parsePercentage(workload['40 a 44 horas'] || '0'),
              '45-48h': parsePercentage(workload['45 a 48 horas'] || '0'),
              '49h+': parsePercentage(workload['49 horas ou mais'] || '0'),
            },
            income: {
              '0-2SM': parsePercentage(income['De 0 até 2 SMilhõesilhões'] || '0'),
              '2-5SM': parsePercentage(income['De 2 até 5 SMilhões'] || '0'),
              '5+SM': parsePercentage(income['De 5 a Milhõesais SMilhões'] || '0'),
            },
            sectors: {
              agribusiness: parsePercentage(sectors['Agronegócio'] || '0'),
              commerce: parsePercentage(sectors['Comércio'] || '0'),
              construction: parsePercentage(sectors['Construção'] || '0'),
              industry: parsePercentage(sectors['Indústria'] || '0'),
              services: parsePercentage(sectors['Serviços'] || '0'),
            },
            tenure: {
              '2y+': 79.53, // Default values since not in new CSVs
              '1-2y': 6.81,
              '1m-1y': 11.37,
              '<1m': 2.29,
            },
            gender: {
              male: parsePercentage(gender['Homem'] || '0'),
              female: parsePercentage(gender['Mulher'] || '0'),
            },
          };
        });

        setData(parsedData);
        setIsLoading(false);
      } catch (err) {
        setError('Erro ao carregar dados do SEBRAE');
        setIsLoading(false);
        console.error('Error loading SEBRAE data:', err);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};
