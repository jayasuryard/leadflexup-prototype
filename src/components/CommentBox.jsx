import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Check } from 'lucide-react';
import { useComments } from '../context/CommentContext';

export const CommentBox = ({ componentId, label, style }) => {
  const { addComment, hasComments, getComments } = useComments();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const boxRef = useRef(null);

  const commented = hasComments(componentId);
  const existingComments = getComments(componentId);

  useEffect(() => {
    const handleOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const handleSend = async () => {
    if (!text.trim()) return;
    setSending(true);
    const ok = await addComment(componentId, text.trim());
    setSending(false);
    if (ok) {
      setText('');
      setSent(true);
      setTimeout(() => setSent(false), 2000);
    }
  };

  return (
    <div ref={boxRef} className={`absolute top-1 right-1 z-[9999] transition-opacity duration-200 ${commented ? 'opacity-100' : 'opacity-0 group-hover/comment:opacity-100'}`} style={style}>
      {/* Toggle Button - always visible if has comments, hover-only otherwise */}
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className={`relative w-6 h-6 rounded-full flex items-center justify-center shadow-md border transition-all hover:scale-110 ${
          commented
            ? 'bg-red-500 border-red-400 hover:bg-red-600'
            : 'bg-yellow-400 border-yellow-500 hover:bg-yellow-500'
        }`}
        title={`Comment on: ${label || componentId}`}
      >
        <MessageSquare className={`w-3 h-3 ${commented ? 'text-white' : 'text-navy-800'}`} />
        {commented && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-700 text-white text-[7px] font-bold rounded-full flex items-center justify-center">
            {existingComments.length}
          </span>
        )}
      </button>

      {/* Comment Popup */}
      {open && (
        <div className="absolute top-9 right-0 w-72 bg-white rounded-xl shadow-2xl border border-navy-100 overflow-hidden" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className={`px-3 py-2 flex items-center justify-between ${commented ? 'bg-red-50 border-b border-red-100' : 'bg-navy-50 border-b border-navy-100'}`}>
            <span className="text-[11px] font-bold text-navy-700 truncate max-w-[200px]">{label || componentId}</span>
            <button onClick={() => setOpen(false)} className="p-0.5 hover:bg-white/60 rounded">
              <X className="w-3.5 h-3.5 text-navy-400" />
            </button>
          </div>

          {/* Existing Comments */}
          {existingComments.length > 0 && (
            <div className="max-h-32 overflow-y-auto px-3 py-2 space-y-2 border-b border-navy-50">
              {existingComments.map((c, i) => (
                <div key={i} className="bg-red-50 rounded-lg p-2 border border-red-100">
                  <p className="text-[11px] text-navy-700 leading-relaxed">{c.comment}</p>
                  <p className="text-[9px] text-navy-400 mt-1">{new Date(c.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3">
            {sent ? (
              <div className="flex items-center gap-2 text-teal-600 py-2">
                <Check className="w-4 h-4" />
                <span className="text-xs font-medium">Comment saved!</span>
              </div>
            ) : (
              <>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Write your feedback or change request..."
                  className="w-full text-xs border border-navy-100 rounded-lg p-2 resize-none h-16 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-300 placeholder:text-navy-300"
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                />
                <button
                  onClick={handleSend}
                  disabled={!text.trim() || sending}
                  className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:bg-navy-200 text-white text-[11px] font-semibold rounded-lg transition-colors"
                >
                  <Send className="w-3 h-3" /> {sending ? 'Sending...' : 'Submit Feedback'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Wrapper component to add comment box to any element
export const Commentable = ({ id, label, children, className = '' }) => {
  return (
    <div className={`relative group/comment ${className}`} data-comment-id={id}>
      {children}
      <CommentBox componentId={id} label={label} />
    </div>
  );
};
