import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from './StatCard';
import { fetchStatisticCount, fetchTimeSpending, fetchCards } from '../services/api';

const CollapsibleStats = () => {
  const PROBLEM_THRESHOLD_PERCENT = 50;

  const [isOpen, setIsOpen] = useState(true);
  const [totalRequests, setTotalRequests] = useState('...');
  const [resolvedByAI, setResolvedByAI] = useState('...');
  const [resolvedByAIPercent, setResolvedByAIPercent] = useState('...');
  const [needsAttention, setNeedsAttention] = useState('...');
  const [avgTime, setAvgTime] = useState('...');
  const [mostFrequentCategory, setMostFrequentCategory] = useState('N/A');
  const [frequentCategoryDifference, setFrequentCategoryDifference] = useState('');
  const [isCategoryProblematic, setIsCategoryProblematic] = useState(false);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const allCount = await fetchStatisticCount('all');
      setTotalRequests(allCount);

      const solvedCount = await fetchStatisticCount('solved');
      setResolvedByAI(solvedCount);

      if (allCount > 0) {
        setResolvedByAIPercent(`${((solvedCount / allCount) * 100).toFixed(0)}%`);
      } else {
        setResolvedByAIPercent('0%');
      }

      const escalatedCount = await fetchStatisticCount('escalated');
      setNeedsAttention(escalatedCount);

      const timeSpending = await fetchTimeSpending();
      const minutes = Math.floor(timeSpending / 60);
      const seconds = Math.round(timeSpending % 60);
      setAvgTime(`${minutes}м ${seconds}с`);

      const allTickets = await fetchCards('all');
      const categoriesMap = {};
      allTickets.forEach(ticket => {
        categoriesMap[ticket.type] = (categoriesMap[ticket.type] || 0) + 1;
      });

      const sortedCategories = Object.entries(categoriesMap)
        .sort(([, countA], [, countB]) => countB - countA)
        .map(([name, value]) => ({ name, value }));

      if (sortedCategories.length > 0) {
        setMostFrequentCategory(sortedCategories[0].name);
        if (sortedCategories.length > 1) {
          const diff = ((sortedCategories[0].value - sortedCategories[1].value) / sortedCategories[1].value) * 100;
          setFrequentCategoryDifference(`+${diff.toFixed(0)}%`);
          setIsCategoryProblematic(diff >= PROBLEM_THRESHOLD_PERCENT);
        } else {
          setFrequentCategoryDifference('единственная');
          setIsCategoryProblematic(false);
        }
      } else {
        setMostFrequentCategory('N/A');
        setFrequentCategoryDifference('');
        setIsCategoryProblematic(false);
      }

    } catch (error) {
      console.error('Ошибка при загрузке общей статистики:', error);
    }
  };

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl mb-6 mx-6 border border-slate-700/50">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-lg font-semibold text-white">Общая статистика</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
          <svg className={`w-6 h-6 text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0'}`}>
        <div className="px-4 pb-4 border-t border-slate-700/50">
          <div className="pt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
            <StatCard title="Всего обращений" value={totalRequests} />
            <StatCard title="Обработано AI" value={resolvedByAI} subValue={resolvedByAIPercent} />
            <StatCard title="Требует внимания" value={needsAttention} />
            <StatCard title="Среднее время решения" value={avgTime} />
            <StatCard
              title="Частая категория"
              value={mostFrequentCategory}
              subValue={frequentCategoryDifference}
              highlight={isCategoryProblematic ? 'red' : 'green'}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Link to="/statistics" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Подробная статистика →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollapsibleStats;