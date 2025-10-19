import { useEffect, useState } from 'react';
import CollapsibleStats from '../components/CollapsibleStats';
import TicketColumn from '../components/TicketColumn';
import { AlertIcon, ProcessIcon, CheckIcon } from '../components/Icons';
import { fetchCards, startSimulation, stopSimulation } from '../services/api';

function DashboardPage() {
  const [needsAttentionTickets, setNeedsAttentionTickets] = useState([]);
  const [inProgressTickets, setInProgressTickets] = useState([]);
  const [resolvedTickets, setResolvedTickets] = useState([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchTickets = async () => {
    try {
      const needsAttention = await fetchCards('escalated');
      setNeedsAttentionTickets(needsAttention.map(t => ({
        id: `#${t.id}`,
          category: t.type || 'N/A',
        summary: `Заявка по ${t.type}. Статус: ${t.status}`,
        userRequest: `Диалог #${t.id}. Тип: ${t.type}. Статус: ${t.status}.`,
        aiAnalysis: {
          confidence: 'N/A',
          reason: 'Передано оператору',
          foundArticles: [],
          suggestedAction: 'Проверить и обработать вручную.'
        }
      })));

      const inProgress = await fetchCards('active');
      setInProgressTickets(inProgress.map(t => ({
        id: `#${t.id}`,
        category: t.type,
        summary: `Заявка по ${t.type}. Статус: ${t.status}`,
      })));

      const resolved = await fetchCards('closed');
      setResolvedTickets(resolved.map(t => ({
        id: `#${t.id}`,
        category: t.type,
        summary: `Заявка по ${t.type}. Статус: ${t.status}`,
        userRequest: `Диалог #${t.id}. Тип: ${t.type}. Статус: ${t.status}.`,
        aiAnalysis: {
          confidence: 'N/A',
          reason: 'Решено автоматически',
          foundArticles: [],
          executedAction: 'N/A',
          generatedResponse: 'Ваш запрос был обработан автоматически.'
        }
      })));
    } catch (error) {
      console.error('Ошибка при загрузке тикетов:', error);
    }
  };

  const toggleSimulation = async () => {
    try {
      if (isSimulationRunning) {
        await stopSimulation();
      } else {
        await startSimulation();
      }
      setIsSimulationRunning(!isSimulationRunning);
      fetchTickets();
    } catch (error) {
      console.error('Ошибка при переключении симуляции:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <header className="flex justify-between items-center p-6 shrink-0">
        <h1 className="text-2xl font-bold">Дашборд автоматизации поддержки</h1>
        <div>
          <button
            onClick={toggleSimulation}
            className={`
              px-5 py-2 rounded-lg font-semibold shadow-lg
              transform transition-transform hover:scale-105 active:scale-95
              ${isSimulationRunning
                ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
              }
            `}
          >
            {isSimulationRunning ? 'Остановить симуляцию' : 'Запустить симуляцию'}
          </button>
        </div>
      </header>

      <div className="px-6 shrink-0">
        <CollapsibleStats />
      </div>

      <main className="flex-1 flex gap-6 px-6 pb-6 min-h-0">
        <TicketColumn title="Требуется оператор" icon={<AlertIcon />} tickets={needsAttentionTickets} />
        <TicketColumn title="В обработке AI" icon={<ProcessIcon />} tickets={inProgressTickets} />
        <TicketColumn title="Решено автоматически" icon={<CheckIcon />} tickets={resolvedTickets} showAddToKbButton={true} />
      </main>
    </div>
  );
}

export default DashboardPage;