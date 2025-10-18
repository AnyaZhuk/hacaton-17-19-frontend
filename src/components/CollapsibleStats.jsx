import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import StatCard from './StatCard';

const CollapsibleStats = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl mb-6 mx-6 border border-slate-700/50">
      <div className="flex justify-between items-center p-4"> 
        <h2 className="text-lg font-semibold text-white">Общая статистика</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
          <svg className={`w-6 h-6 text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </button>
      </div>
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4 border-t border-slate-700/50">
          <div className="pt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
            <StatCard title="Всего обращений" value="5,128" />
            <StatCard title="Обработано AI" value="4,461" subValue="87%" />
            <StatCard title="Требует внимания" value="667" />
            <StatCard title="Среднее время решения" value="1м 25с" />
            <StatCard title="Экономия (расчетная)" value="267,660 ₽" />
          </div>
          
          <div className="mt-4 flex justify-end">
            <Link 
              to="/statistics" 
              className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Подробная статистика →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CollapsibleStats;