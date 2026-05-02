import { useState } from 'react';
import { MessageSquare, X, Clock, MapPin, Filter } from 'lucide-react';
import { useComments } from '../context/CommentContext';

export const CommentPanel = () => {
  const { getAllComments, showPanel, setShowPanel } = useComments();
  const [filterStatus, setFilterStatus] = useState('all');
  const allComments = getAllComments();

  const filtered = filterStatus === 'all' ? allComments : allComments.filter(c => c.status === filterStatus);

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        className="fixed bottom-6 right-6 z-[99999] w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
        title="View all comments"
      >
        <MessageSquare className="w-5 h-5" />
        {allComments.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-red-600 text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-red-500">
            {allComments.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed top-0 right-0 z-[99999] w-full sm:w-[380px] h-full bg-white shadow-2xl border-l border-navy-100 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-navy-100 bg-navy-800 text-white">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <h2 className="text-sm font-bold">Prototype Comments</h2>
          <span className="px-1.5 py-0.5 bg-red-500 text-[9px] font-bold rounded-full">{allComments.length}</span>
        </div>
        <button onClick={() => setShowPanel(false)} className="p-1 hover:bg-white/10 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filter */}
      <div className="px-4 py-2 border-b border-navy-50 flex items-center gap-2">
        <Filter className="w-3 h-3 text-navy-400" />
        {['all', 'pending', 'resolved'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-2 py-0.5 text-[10px] font-medium rounded-full capitalize ${filterStatus === s ? 'bg-navy-800 text-white' : 'bg-navy-50 text-navy-500'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-navy-300">
            <MessageSquare className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-xs">No comments yet</p>
            <p className="text-[10px] text-navy-400 mt-1">Click comment icons on components to add feedback</p>
          </div>
        ) : (
          <div className="divide-y divide-navy-50">
            {filtered.map((c, i) => (
              <div key={i} className="px-4 py-3 hover:bg-navy-25 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${c.status === 'resolved' ? 'bg-teal-500' : 'bg-red-500'}`} />
                      <span className="text-[11px] font-bold text-navy-800 truncate">{c.component_id}</span>
                    </div>
                    <p className="text-xs text-navy-700 leading-relaxed">{c.comment}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[9px] text-navy-400 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" /> {new Date(c.created_at).toLocaleString()}
                      </span>
                      <span className="text-[9px] text-navy-400 flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" /> {c.page || '/'}
                      </span>
                    </div>
                  </div>
                  <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded ${c.status === 'resolved' ? 'bg-teal-50 text-teal-700' : 'bg-red-50 text-red-600'}`}>
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
