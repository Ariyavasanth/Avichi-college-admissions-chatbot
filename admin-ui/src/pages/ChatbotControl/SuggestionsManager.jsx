import { useState } from "react";
import { Loader2, Plus, Edit2, Trash2, ArrowUp, ArrowDown, Save, X } from "lucide-react";
import toast from "react-hot-toast";
import { createSuggestion, updateSuggestion, deleteSuggestion } from "../../services/chatbotConfigService";

const SuggestionsManager = ({ suggestions, setSuggestions }) => {
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const handleCreate = async () => {
    if (!newText.trim()) return toast.error("Suggestion text cannot be empty");
    setLoading(true);
    try {
      const data = await createSuggestion(newText);
      setSuggestions([...suggestions, data.suggestion]);
      setNewText("");
      setIsAdding(false);
      toast.success("Suggestion created");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this suggestion?")) return;
    try {
      await deleteSuggestion(id);
      setSuggestions(suggestions.filter(s => s._id !== id));
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const startEdit = (suggestion) => {
    setEditId(suggestion._id);
    setEditText(suggestion.text);
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    try {
      await updateSuggestion(editId, { text: editText });
      setSuggestions(suggestions.map(s => s._id === editId ? { ...s, text: editText } : s));
      setEditId(null);
      toast.success("Updated");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const moveRow = async (index, direction) => {
    const newIdx = index + direction;
    if (newIdx < 0 || newIdx >= suggestions.length) return;
    
    // Swap order property visually
    const items = [...suggestions];
    const tempOrder = items[index].order;
    items[index].order = items[newIdx].order;
    items[newIdx].order = tempOrder;
    
    // Swap array position
    const temp = items[index];
    items[index] = items[newIdx];
    items[newIdx] = temp;
    
    setSuggestions(items);

    // Call APIs independently to update new orders mapping
    try {
      await Promise.all([
        updateSuggestion(items[index]._id, { order: items[index].order }),
        updateSuggestion(items[newIdx]._id, { order: items[newIdx].order })
      ]);
    } catch (err) {
      toast.error("Failed to sync new order with backend");
    }
  };

  return (
    <div>
      <div className="settings-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2>Suggested Queries</h2>
          <p>Quick reply logic rendered above the user chatbox input.</p>
        </div>
        {!isAdding && (
          <button onClick={() => setIsAdding(true)} className="logout-btn">
            <Plus size={16} /> Add New
          </button>
        )}
      </div>

      {isAdding && (
        <div className="suggestion-item" style={{ marginBottom: "16px", borderColor: "#3b82f6", background: "#eff6ff" }}>
          <input 
            autoFocus
            type="text" 
            className="suggestion-input" 
            value={newText} 
            onChange={e => setNewText(e.target.value)} 
            placeholder="E.g., How do I apply?"
            onKeyDown={e => e.key === "Enter" && handleCreate()}
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={handleCreate} className="icon-btn" style={{ color: "#16a34a" }} disabled={loading}>
              <Save size={18} />
            </button>
            <button onClick={() => setIsAdding(false)} className="icon-btn danger">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {suggestions.length === 0 && !isAdding ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
          No suggestions configured. Click Add New to start.
        </div>
      ) : null}

      <div className="suggestion-list">
        {suggestions.map((item, index) => (
          <div key={item._id} className="suggestion-item">
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <button 
                onClick={() => moveRow(index, -1)} 
                className="icon-btn" 
                disabled={index === 0} 
                style={{ opacity: index === 0 ? 0.3 : 1 }}
              >
                <ArrowUp size={14} />
              </button>
              <button 
                onClick={() => moveRow(index, 1)} 
                className="icon-btn" 
                disabled={index === suggestions.length - 1}
                style={{ opacity: index === suggestions.length - 1 ? 0.3 : 1 }}
              >
                <ArrowDown size={14} />
              </button>
            </div>
            
            {editId === item._id ? (
              <input 
                autoFocus
                type="text" 
                className="suggestion-input" 
                value={editText} 
                onChange={e => setEditText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSaveEdit()}
              />
            ) : (
              <div className="suggestion-input">{item.text}</div>
            )}

            <div style={{ display: "flex", gap: "8px" }}>
              {editId === item._id ? (
                <>
                  <button onClick={handleSaveEdit} className="icon-btn" style={{ color: "#16a34a" }}>
                    <Save size={16} />
                  </button>
                  <button onClick={() => setEditId(null)} className="icon-btn danger">
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(item)} className="icon-btn">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="icon-btn danger">
                    <Trash2 size={16} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionsManager;
