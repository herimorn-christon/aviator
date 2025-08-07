import React, { useState } from 'react';
import { format } from 'date-fns';
import { Trash2, Edit, Save, X } from 'lucide-react';
import { AviatorData } from '../types';
import { useDataStore } from '../store/dataStore';

interface DataTableProps {
  data: AviatorData[];
  limit?: number;
  showActions?: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({ 
  data, 
  limit,
  showActions = true
}) => {
  const { deleteDataPoint, updateDataPoint, settings } = useDataStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<AviatorData>>({});
  
  const displayData = limit ? data.slice(-limit) : data;
  
  const handleEdit = (id: string, data: AviatorData) => {
    setEditingId(id);
    setEditData({
      multiplier: data.multiplier,
      platform: data.platform,
      notes: data.notes || '',
    });
  };
  
  const handleSave = (id: string) => {
    updateDataPoint(id, editData);
    setEditingId(null);
    setEditData({});
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };
  
  if (displayData.length === 0) {
    return (
      <div className={`p-4 rounded-lg text-center ${settings.darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        No data available. Start collecting aviator results.
      </div>
    );
  }
  
  return (
    <div className={`overflow-x-auto rounded-lg shadow ${settings.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className={settings.darkMode ? 'bg-gray-700' : 'bg-gray-50'}>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Multiplier</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Platform</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Notes</th>
            {showActions && (
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className={`divide-y ${settings.darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          {displayData.map((item) => (
            <tr key={item.id} className={settings.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {format(item.timestamp, 'MMM d, yyyy HH:mm:ss')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === item.id ? (
                  <input
                    type="number"
                    step="0.01"
                    min="1.01"
                    value={editData.multiplier}
                    onChange={(e) => setEditData({ ...editData, multiplier: parseFloat(e.target.value) })}
                    className={`w-24 px-2 py-1 border rounded ${
                      settings.darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white'
                    }`}
                  />
                ) : (
                  <span className={`font-mono text-lg ${item.multiplier >= 2 ? 'text-green-500' : 'text-red-500'}`}>
                    {item.multiplier.toFixed(2)}x
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={editData.platform}
                    onChange={(e) => setEditData({ ...editData, platform: e.target.value })}
                    className={`w-32 px-2 py-1 border rounded ${
                      settings.darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white'
                    }`}
                  />
                ) : (
                  item.platform
                )}
              </td>
              <td className="px-6 py-4 text-sm max-w-xs truncate">
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={editData.notes || ''}
                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                    className={`w-full px-2 py-1 border rounded ${
                      settings.darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white'
                    }`}
                  />
                ) : (
                  item.notes || '-'
                )}
              </td>
              {showActions && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  {editingId === item.id ? (
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleSave(item.id)}
                        className="text-green-500 hover:text-green-600"
                      >
                        <Save size={18} />
                      </button>
                      <button 
                        onClick={handleCancelEdit}
                        className="text-gray-500 hover:text-gray-600"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(item.id, item)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => deleteDataPoint(item.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};