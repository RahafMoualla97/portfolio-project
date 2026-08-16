import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getMessages, deleteMessage, markMessageAsRead } from '../../api/messages';

/**
 * AdminMessages component - Manage contact messages.
 */
const AdminMessages = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await getMessages(token);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markMessageAsRead(id, token);
      await fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await deleteMessage(id, token);
      await fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-600">Loading messages...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Messages</h2>
      
      {messages.length === 0 ? (
        <p className="text-center py-8 text-gray-500">No messages yet.</p>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-xl shadow-md p-3 sm:p-4 border-l-4 ${
                msg.is_read ? 'border-gray-300' : 'border-indigo-600'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                <div className="flex-1 w-full sm:w-auto">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{msg.name}</h3>
                    <span className="text-xs sm:text-sm text-gray-500">{msg.email}</span>
                    {!msg.is_read && (
                      <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  {msg.subject && (
                    <p className="text-xs sm:text-sm font-medium text-gray-700 mt-1">Subject: {msg.subject}</p>
                  )}
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">{msg.message}</p>
                  <p className="text-xs text-gray-400 mt-1 sm:mt-2">
                    {new Date(msg.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  {!msg.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(msg.id)}
                      className="bg-green-600 text-white px-2 sm:px-3 py-1 rounded hover:bg-green-700 transition text-xs sm:text-sm whitespace-nowrap"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded hover:bg-red-700 transition text-xs sm:text-sm whitespace-nowrap"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;