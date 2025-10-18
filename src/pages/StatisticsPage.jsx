import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchStatisticCount, fetchTimeSpending, fetchCards } from './../services/api';

const KpiCard = ({ title, value, highlight }) => {
  const isHighlighted = highlight === 'red' || highlight === 'green';
  const borderColor = highlight === 'red' ? 'border-red-700/50' : 'border-green-700/50';
  const textColor = highlight === 'red' ? 'text-red-400' : 'text-green-400';

  return (
    <div className={`bg-slate-800/50 p-6 rounded-xl border w-full transition-all duration-300 ${isHighlighted ? borderColor : 'border-slate-700/50'}`}>
      <p className="text-sm text-gray-400">{title}</p>
      <p className={`text-4xl font-bold mt-1 flex items-baseline truncate ${isHighlighted ? textColor : 'text-white'}`}>
        {value}
      </p>
    </div>
  );
};

const ChartCard = ({ title, children, className = '' }) => (
  <div className={`bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 flex flex-col ${className}`}>
    <h3 className="text-lg font-semibold text-white mb-4 shrink-0">{title}</h3>
    {children}
  </div>
);

function StatisticsPage() {
  const PROBLEM_THRESHOLD_PERCENT = 50;

  const [totalCount, setTotalCount] = useState('...');
  const [resolvedCount, setResolvedCount] = useState('...');
  const [resolvedPercent, setResolvedPercent] = useState('...');
  const [avgTime, setAvgTime] = useState('...');
  const [mockCategories, setMockCategories] = useState([]);
  const [mockToolUsage, setMockToolUsage] = useState([]);
  const [mockEvents, setMockEvents] = useState([]);
  const [mostFrequentCategory, setMostFrequentCategory] = useState('N/A');
  const [frequentCategoryDifference, setFrequentCategoryDifference] = useState('');
  const [isCategoryProblematic, setIsCategoryProblematic] = useState(false);

  useEffect(() => {
    fetchStatistics();
    const interval = setInterval(fetchStatistics, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatistics = async () => {
    try {
      const allCount = await fetchStatisticCount('all');
      setTotalCount(allCount);

      const solvedCount = await fetchStatisticCount('solved');
      setResolvedCount(solvedCount);

      if (allCount > 0) {
        setResolvedPercent(`(${(solvedCount / allCount * 100).toFixed(0)}%)`);
      } else {
        setResolvedPercent('(0%)');
      }

      const timeSpending = await fetchTimeSpending();
      const minutes = Math.floor(timeSpending / 60);
      const seconds = Math.round(timeSpending % 60);
      setAvgTime(`${minutes}м ${seconds}с`);

      const allTickets = await fetchCards('all');
      const categoriesMap = {};
      const toolUsageMap = {};
      const eventsList = [];

      allTickets.forEach(ticket => {
        categoriesMap[ticket.type] = (categoriesMap[ticket.type] || 0) + 1;

        if (ticket.status === 'solved' && ticket.resolved_at) {
          eventsList.push({ type: 'success', text: `Тикет #${ticket.dialog_id} решен автоматически.`, time: formatTimeAgo(ticket.resolved_at) });
          toolUsageMap[`solve_${ticket.type}`] = (toolUsageMap[`solve_${ticket.type}`] || 0) + 1;
        } else if (ticket.status === 'escalated') {
          eventsList.push({ type: 'warning', text: `Диалог #${ticket.dialog_id} эскалирован на оператора.`, time: formatTimeAgo(ticket.created_at) });
        } else {
          eventsList.push({ type: 'info', text: `Получен новый тикет #${ticket.dialog_id}.`, time: formatTimeAgo(ticket.created_at) });
        }
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

      setMockCategories(sortedCategories);
      setMockToolUsage(Object.entries(toolUsageMap).map(([name, count]) => ({ name, count })));
      setMockEvents(eventsList.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10));

    } catch (error) {
      console.error('Ошибка при загрузке подробной статистики:', error);
    }
  };

  const formatTimeAgo = (isoString) => {
    if (!isoString) return 'Сейчас';
    const date = new Date(isoString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    if (seconds < 60) return `${seconds} сек назад`;
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} мин назад`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours} час назад`;
    const days = Math.round(hours / 24);
    return `${days} дн назад`;
  };

  const maxCategoryValue = Math.max(...mockCategories.map(c => c.value), 1);
  const maxToolUsage = Math.max(...mockToolUsage.map(t => t.count), 1);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-900 text-white">
      <header className="flex justify-between items-center p-6 shrink-0 border-b border-slate-800">
        <h1 className="text-2xl font-bold">Подробная статистика</h1>
        <Link to="/" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
          ← Назад к дашборду
        </Link>
      </header>

      <div className="flex-1 flex flex-row overflow-hidden">
        <aside className="w-72 shrink-0 p-6 border-r border-slate-800 flex flex-col gap-6">
          <KpiCard title="Всего обращений" value={totalCount} />
          <KpiCard
            title="Решено AI"
            value={
              <>
                {resolvedCount}
                <span className="text-2xl font-semibold text-green-400 ml-2">
                  {resolvedPercent}
                </span>
              </>
            }
          />
          <KpiCard title="Среднее время решения" value={avgTime} />
          <KpiCard
            title="Самая частая категория"
            value={
              <>
                {mostFrequentCategory}
                <span className={`text-xl font-semibold ml-2 ${isCategoryProblematic ? 'text-red-300' : 'text-green-300'}`}>
                  {frequentCategoryDifference}
                </span>
              </>
            }
            highlight={isCategoryProblematic ? 'red' : 'green'}
          />
        </aside>

        <main className="flex-1 flex flex-col gap-6 p-6 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
            <div className="lg:col-span-2">
              <ChartCard title="Статистика по категориям">
                <div className="space-y-3 mt-2">
                  {mockCategories.map(cat => (
                    <div key={cat.name} className="flex items-center text-sm">
                      <span className="w-36 text-gray-400 truncate">{cat.name}</span>
                      <div className="flex-1 bg-slate-700 rounded-full h-4 mr-2">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-4 rounded-full"
                          style={{ width: `${(cat.value / maxCategoryValue) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold">{cat.value}</span>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>

            <div className="lg:col-span-1">
              <ChartCard title="Частота использования инструментов">
                <div className="space-y-3 mt-2">
                  {mockToolUsage.map(tool => (
                    <div key={tool.name} className="flex items-center text-sm">
                      <span className="w-36 text-gray-400 font-mono truncate">{tool.name}</span>
                      <div className="flex-1 bg-slate-700 rounded-full h-4 mr-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full"
                          style={{ width: `${(tool.count / maxToolUsage) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold">{tool.count}</span>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>
          </div>

          <div className="flex-1 min-h-0">
              <ChartCard title="Лента событий системы" className="h-full">
                  <div className="flex-1 overflow-y-auto -mr-2 pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                    <ul className="space-y-3 mt-2 text-sm">
                        {mockEvents.map((event, i) => (
                            <li key={i} className="flex items-center">
                                <span className={`mr-3 w-2 h-2 rounded-full ${event.type === 'success' ? 'bg-green-500' : event.type === 'warning' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                                <span className="flex-1">{event.text}</span>
                                <span className="text-gray-500">{event.time}</span>
                            </li>
                        ))}
                    </ul>
                  </div>
              </ChartCard>
          </div>
        </main>
      </div>
    </div>
  );
}

export default StatisticsPage;