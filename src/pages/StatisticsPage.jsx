import { Link } from 'react-router-dom';

const mockKpi = {
  total: '12,834',
  resolvedByAINumber: '11,167', 
  resolvedByAIPercent: '(87%)', 
  avgTime: '1м 15с',
};
const mockCategories = [ { name: 'Сброс пароля', value: 4230 }, { name: 'Доступ к VPN', value: 2105 }, { name: 'Настройка ПО', value: 1890 }, { name: 'Заказ оборудования', value: 1520 }, { name: '1C: Ошибки', value: 980 }, { name: 'Другое', value: 1109 }, ];
const mockToolUsage = [ { name: 'reset_password', count: 4100 }, { name: 'check_vpn_status', count: 1800 }, { name: 'get_order_status', count: 1450 }, { name: 'grant_access_1c', count: 850 }, ];
const mockEvents = [ { type: 'success', text: 'Тикет #82543 решен автоматически.', time: '1 мин назад' }, { type: 'info', text: 'Вызван инструмент reset_password для пользователя Ivanov I.I.', time: '2 мин назад' }, { type: 'warning', text: 'Диалог #82541 эскалирован на оператора (низкая уверенность).', time: '5 мин назад' }, { type: 'success', text: 'Тикет #82542 решен автоматически.', time: '7 мин назад' }, { type: 'info', text: 'Получен новый тикет #82544.', time: '8 мин назад' }, { type: 'success', text: 'Тикет #82545 решен автоматически.', time: '10 мин назад' }, { type: 'warning', text: 'Диалог #82546 эскалирован на оператора.', time: '12 мин назад' }, { type: 'info', text: 'Получен новый тикет #82547.', time: '15 мин назад' }, { type: 'success', text: 'Тикет #82548 решен автоматически.', time: '18 мин назад' } ];

const KpiCard = ({ title, value }) => (
  <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 w-full">
    <p className="text-sm text-gray-400">{title}</p>
    <p className="text-4xl font-bold text-white mt-1 flex items-baseline">
      {value}
    </p>
  </div>
);

const ChartCard = ({ title, children, className = '' }) => (
  <div className={`bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 flex flex-col ${className}`}>
    <h3 className="text-lg font-semibold text-white mb-4 shrink-0">{title}</h3>
    {children}
  </div>
);

function StatisticsPage() {
  const maxCategoryValue = Math.max(...mockCategories.map(c => c.value));
  const maxToolUsage = Math.max(...mockToolUsage.map(t => t.count));

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
          <KpiCard title="Всего обращений" value={mockKpi.total} />
          <KpiCard 
            title="Решено AI" 
            value={
              <>
                {mockKpi.resolvedByAINumber}
                <span className="text-2xl font-semibold text-green-400 ml-2">
                  {mockKpi.resolvedByAIPercent}
                </span>
              </>
            } 
          />
          <KpiCard title="Среднее время решения" value={mockKpi.avgTime} />
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