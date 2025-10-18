import TicketCard from "./TicketCard";

const TicketColumn = ({ title, icon, tickets, showAddToKbButton }) => (
  <div className="flex-1 bg-slate-800/30 backdrop-blur-sm rounded-xl flex flex-col border border-slate-700/50 min-h-0">
    <h3 className="text-md font-bold text-white flex items-center p-4 border-b border-slate-700/50 shrink-0">
      {icon} {title}
      <span className="ml-2 bg-slate-700 text-gray-300 text-xs font-semibold px-2 py-0.5 rounded-full">{tickets.length}</span>
    </h3>
    <div className="space-y-4 overflow-y-auto flex-1 p-4 
                    scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
      {tickets.map(ticket => (
        <TicketCard key={ticket.id} ticket={ticket} showAddToKbButton={showAddToKbButton} />
      ))}
    </div>
  </div>
);

export default TicketColumn;