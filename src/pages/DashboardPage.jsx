import {useEffect, useState} from 'react';
import CollapsibleStats from '../components/CollapsibleStats';
import TicketColumn from '../components/TicketColumn';
import {AlertIcon, ProcessIcon, CheckIcon} from '../components/Icons';
import {fetchCards, startSimulation, stopSimulation} from '../services/api';
import useSimulationStore from '../store/simulationStore';

function DashboardPage() {
  const [needsAttentionTickets, setNeedsAttentionTickets] = useState([]);
  const [inProgressTickets, setInProgressTickets] = useState([]);
  const [resolvedTickets, setResolvedTickets] = useState([]);

  const {isSimulationRunning, checkStatus, start, stop} = useSimulationStore();

  useEffect(() => {
    checkStatus();
    fetchTickets().catch(console.error);

    const interval = setInterval(() => {
      fetchTickets().catch(console.error);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const truncate = (text, length) => {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  const processTicketData = (ticket) => {
    const {ml_result, user_query} = ticket;
    const payload = ml_result?.payload || {};

    const baseInfo = {
      id: `#${ticket.id}`,
      category: ticket.type || 'N/A',
      summary: truncate(user_query || `Заявка #${ticket.id}`, 100),
      userRequest: user_query || `Диалог #${ticket.id}`,
    };

    let aiAnalysis;

    if (ticket.status === 'closed' && ml_result) {
      const bestSource = payload.sources?.[0];
      aiAnalysis = {
        confidence: bestSource ? `${(bestSource.score * 100).toFixed(0)}%` : 'N/A',
        reason: 'Решено автоматически по базе знаний.',
        sources: bestSource ? [bestSource.filename.split('/').pop()] : [],
        generatedResponse: payload.summary,
      };
    } else if (ticket.status === 'escalated' && ml_result) {
      aiAnalysis = {
        confidence: 'Низкая',
        reason: payload.reason || 'Не найдено релевантного ответа в БЗ.',
        sources: [],
        suggestedAction: 'Требуется ручная обработка оператором.',
      };
    } else {
      aiAnalysis = {
        reason: 'AI анализирует обращение...',
      };
    }

    return {...baseInfo, aiAnalysis};
  };

  const fetchTickets = async () => {
    try {
      const needsAttention = await fetchCards('escalated');
      setNeedsAttentionTickets(needsAttention.map(processTicketData).reverse());

      const inProgress = await fetchCards('active');
      setInProgressTickets(inProgress.map(processTicketData).reverse());

      const resolved = await fetchCards('closed');
      setResolvedTickets(resolved.map(processTicketData).reverse());
    } catch (error) {
      console.error('Ошибка при загрузке тикетов:', error);
    }
  };

  const toggleSimulation = async () => {
    try {
      if (isSimulationRunning) {
        await stopSimulation();
        stop();
      } else {
        await startSimulation();
        start();
      }
      await fetchTickets();
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
        <CollapsibleStats/>
      </div>

      <main className="flex-1 flex gap-6 px-6 pb-6 min-h-0">
        <TicketColumn title="Требуется оператор" icon={<AlertIcon/>} tickets={needsAttentionTickets}/>
        <TicketColumn title="В обработке AI" icon={<ProcessIcon/>} tickets={inProgressTickets}/>
        <TicketColumn title="Решено автоматически" icon={<CheckIcon/>} tickets={resolvedTickets}
                      showAddToKbButton={true}/>
      </main>
    </div>
  );
}

export default DashboardPage;