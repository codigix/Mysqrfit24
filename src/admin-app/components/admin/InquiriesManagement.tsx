import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { ContactMessage } from '@/types/site';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mail, Phone } from 'lucide-react';

const InquiriesManagement = () => {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const contactsData = await apiService.inquiries.getContacts();
      setContacts(contactsData);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'new' ? 'read' : 'new';
      await apiService.contact.updateMessage(id, newStatus);
      toast.success(`Marked as ${newStatus}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Contact Messages</h2>

      <div className="space-y-3">
        {contacts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No contact messages yet
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() =>
                setExpandedId(expandedId === contact.id ? null : contact.id)
              }
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.email}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 text-xs rounded font-medium ${
                      contact.status === 'new'
                        ? 'bg-red-100 text-red-800'
                        : contact.status === 'read'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {contact.status}
                  </span>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {expandedId === contact.id && (
                <div className="mt-4 pt-4 border-t">
                  <div className="bg-slate-50 p-3 rounded">
                    <p className="text-sm font-medium mb-2">Message:</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {contact.message}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateStatus(contact.id, contact.status);
                      }}
                    >
                      Mark as {contact.status === 'new' ? 'Read' : 'New'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Reply
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InquiriesManagement;
