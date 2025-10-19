import { useState } from 'react';
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;

const TicketCard = ({ ticket, showAddToKbButton }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    return (
        <div
            className="bg-slate-800 p-4 rounded-xl cursor-pointer hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 border border-slate-700/50 animate-fade-in-up"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-gray-400">{ticket.id}</span>
                <span className="text-xs bg-indigo-600/50 text-indigo-300 px-2 py-1 rounded-full font-medium">{ticket.category}</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-white">{ticket.summary}</p>

            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px] mt-4 pt-4 border-t border-slate-700/50' : 'max-h-0'}`}>
                <div className="text-xs opacity-0 animate-fade-in-up [animation-delay:150ms]">
                    <h4 className="font-bold text-gray-400 mb-2">Запрос клиента:</h4>
                    <p className="bg-slate-900/70 p-3 rounded whitespace-pre-wrap font-mono text-gray-300">{ticket.userRequest}</p>

                    <h4 className="font-bold text-gray-400 mt-4 mb-2">Анализ и решение AI:</h4>
                    <div className="bg-slate-900/70 p-3 rounded font-mono space-y-2 text-gray-300">
                        {ticket.aiAnalysis?.confidence && <p><span className="text-cyan-400 font-semibold">Уверенность:</span> {ticket.aiAnalysis.confidence}</p>}
                        {ticket.aiAnalysis?.reason && <p><span className="text-cyan-400 font-semibold">Вердикт:</span> {ticket.aiAnalysis.reason}</p>}
                        {ticket.aiAnalysis?.sources && ticket.aiAnalysis.sources.length > 0 &&
                            <p><span className="text-cyan-400 font-semibold">Источник:</span> {ticket.aiAnalysis.sources.join(', ')}</p>
                        }
                        {ticket.aiAnalysis?.generatedResponse && <p className="whitespace-pre-wrap"><span className="text-cyan-400 font-semibold">Ответ:</span> {ticket.aiAnalysis.generatedResponse}</p>}
                        {ticket.aiAnalysis?.suggestedAction && <p><span className="text-cyan-400 font-semibold">Действие:</span> {ticket.aiAnalysis.suggestedAction}</p>}
                    </div>

                    {showAddToKbButton && (
                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsSubmitted(true); }}
                                disabled={isSubmitted}
                                className="text-xs bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-4 py-2 rounded-md font-semibold transition-all duration-300 transform hover:scale-105 flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                            >
                                {isSubmitted ? ( <><CheckCircleIcon /> Решение добавлено в БЗ</> ) : ( "Добавить в базу знаний" )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketCard;