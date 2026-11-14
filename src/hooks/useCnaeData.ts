import { useState, useEffect } from 'react';

export interface CnaeActivity {
  nr: number;
  section: string;
  cnaeCode: string;
  denomination: string;
  establishmentCount: number | string; // Can be a number or "Sem informação"
}

export const useCnaeData = () => {
  const [data, setData] = useState<CnaeActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/cnae-data.csv');
        const text = await response.text();
        
        const lines = text.split('\n').slice(1); // Skip header row
        const parsedData: CnaeActivity[] = [];

        lines.forEach(line => {
          if (!line.trim()) return;
          
          // Handle CSV with quoted fields containing commas
          const regex = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/;
          const values = line.split(regex).map(v => v.replace(/^"|"$/g, '').trim());
          
          if (values.length < 5) return;

          // Parse establishment count - check for "Sem a informação" message
          const rawCount = values[4]?.trim() || '';
          let establishmentCount: number | string;
          
          if (rawCount.toLowerCase().includes('sem a informação') || 
              rawCount.toLowerCase().includes('sem informação')) {
            establishmentCount = 'Sem informação em sistema';
          } else {
            const cleanedCount = rawCount.replace(/\./g, '');
            const parsed = parseInt(cleanedCount);
            establishmentCount = isNaN(parsed) ? 0 : parsed;
          }
          
          const activity: CnaeActivity = {
            nr: parseInt(values[0]) || 0,
            section: values[1],
            cnaeCode: values[2],
            denomination: values[3],
            establishmentCount,
          };

          parsedData.push(activity);
        });

        // Sort by establishment count (descending) - items with "Sem informação" go to the end
        parsedData.sort((a, b) => {
          const aCount = typeof a.establishmentCount === 'string' ? -1 : a.establishmentCount;
          const bCount = typeof b.establishmentCount === 'string' ? -1 : b.establishmentCount;
          return bCount - aCount;
        });

        setData(parsedData);
        setIsLoading(false);
      } catch (err) {
        setError('Erro ao carregar dados CNAE');
        setIsLoading(false);
        console.error('Error loading CNAE data:', err);
      }
    };

    fetchData();
  }, []);

  const searchActivities = (query: string): CnaeActivity[] => {
    if (!query.trim()) return data.slice(0, 50); // Return top 50 if no search

    const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    return data.filter(activity => {
      const normalizedDenomination = activity.denomination.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const normalizedSection = activity.section.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      
      return (
        activity.cnaeCode.includes(query) ||
        normalizedDenomination.includes(normalizedQuery) ||
        normalizedSection.includes(normalizedQuery)
      );
    }).slice(0, 100); // Limit to 100 results
  };

  const getSectionSummary = () => {
    const sectionMap = new Map<string, { count: number; establishments: number }>();
    
    data.forEach(activity => {
      const section = activity.section;
      const current = sectionMap.get(section) || { count: 0, establishments: 0 };
      const countToAdd = typeof activity.establishmentCount === 'string' ? 0 : activity.establishmentCount;
      sectionMap.set(section, {
        count: current.count + 1,
        establishments: current.establishments + countToAdd,
      });
    });

    return Array.from(sectionMap.entries())
      .map(([section, stats]) => ({ section, ...stats }))
      .sort((a, b) => b.establishments - a.establishments);
  };

  return { 
    data, 
    isLoading, 
    error, 
    searchActivities,
    getSectionSummary,
    totalActivities: data.length,
    totalEstablishments: data.reduce((sum, act) => {
      const count = typeof act.establishmentCount === 'string' ? 0 : act.establishmentCount;
      return sum + count;
    }, 0),
  };
};
