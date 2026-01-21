import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import { ContactMessage, Inquiry } from '@/types/site';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Mail, Phone, MessageSquare, Bot, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const InquiriesManagement = () => {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [chatbotInquiries, setChatbotInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [contactsData, chatbotData] = await Promise.all([
        apiService.inquiries.getContacts(),
        apiService.chatbot.getAllInquiries()
      ]);
      setContacts(contactsData);
      setChatbotInquiries(chatbotData);
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

  const handleDeleteChatbotInquiry = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      await apiService.chatbot.deleteInquiry(id);
      toast.success('Inquiry deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete inquiry');
    }
  };

  const handleDeleteContactMessage = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await apiService.contact.deleteMessage(id);
      toast.success('Message deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Inquiries & Messages</h2>
        <Button variant="outline" size="sm" onClick={fetchData}>Refresh</Button>
      </div>

      <Tabs defaultValue="contacts" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Contact Messages ({contacts.length})
          </TabsTrigger>
          <TabsTrigger value="chatbot" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Chatbot Inquiries ({chatbotInquiries.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts">
          <div className="space-y-4">
            {contacts.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                No contact messages yet
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`border rounded-lg p-5 transition-all cursor-pointer ${
                    expandedId === contact.id ? 'ring-2 ring-orange-500 shadow-lg' : 'hover:shadow-md bg-white'
                  }`}
                  onClick={() => setExpandedId(expandedId === contact.id ? null : contact.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-900">{contact.name}</p>
                        {contact.status === 'new' && (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 rounded-full">New</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <a 
                          href={`mailto:${contact.email}`} 
                          className="flex items-center gap-1 hover:text-orange-600 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Mail className="h-3 w-3" /> {contact.email}
                        </a>
                        {contact.phone && (
                          <a 
                            href={`tel:${contact.phone}`} 
                            className="flex items-center gap-1 hover:text-orange-600 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone className="h-3 w-3" /> {contact.phone}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-400">
                        {contact.created_at ? new Date(contact.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'}
                      </p>
                      {contact.property_name ? (
                        <p className="text-xs text-orange-600 font-bold mt-1 truncate max-w-[250px]">
                          Inquiry for {contact.property_name}
                        </p>
                      ) : contact.subject ? (
                        <p className="text-xs text-orange-600 font-medium mt-1 truncate max-w-[200px]">{contact.subject}</p>
                      ) : null}
                    </div>
                  </div>

                  {expandedId === contact.id && (
                    <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Message Body</p>
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {contact.message}
                        </p>
                      </div>
                      
                      {contact.property_id && (
                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                          <span className="font-bold">Property ID:</span>
                          <code className="bg-slate-100 px-2 py-1 rounded text-orange-700">{contact.property_id}</code>
                        </div>
                      )}

                      <div className="flex justify-between items-center mt-6">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant={contact.status === 'new' ? 'default' : 'outline'}
                            className={contact.status === 'new' ? 'bg-orange-600 hover:bg-orange-700' : ''}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `mailto:${contact.email}?subject=Re: ${contact.subject || 'Inquiry'}`;
                            }}
                          >
                            Reply via Email
                          </Button>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteContactMessage(contact.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="chatbot">
          <div className="space-y-4">
            {chatbotInquiries.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                No chatbot inquiries yet
              </div>
            ) : (
              chatbotInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className={`border rounded-lg p-5 transition-all cursor-pointer ${
                    expandedId === inquiry.id ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md bg-white'
                  }`}
                  onClick={() => setExpandedId(expandedId === inquiry.id ? null : inquiry.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-900">{inquiry.name || 'Anonymous'}</p>
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 rounded-full">
                          {inquiry.property_type === 'buy' ? 'Buying' : 'Renting'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        {inquiry.email && (
                          <a 
                            href={`mailto:${inquiry.email}`} 
                            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Mail className="h-3 w-3" /> {inquiry.email}
                          </a>
                        )}
                        {inquiry.phone && (
                          <a 
                            href={`tel:${inquiry.phone}`} 
                            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone className="h-3 w-3" /> {inquiry.phone}
                          </a>
                        )}
                        {!inquiry.email && !inquiry.phone && inquiry.contact && (
                          <a 
                            href={`tel:${inquiry.contact}`} 
                            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Phone className="h-3 w-3" /> {inquiry.contact}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-slate-400">
                        {inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'}
                      </p>
                      <p className="text-xs text-blue-600 font-medium mt-1">{inquiry.location}</p>
                    </div>
                  </div>

                  {expandedId === inquiry.id && (
                    <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Budget</p>
                          <p className="text-sm font-semibold text-slate-700">{inquiry.budget || 'Not specified'}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Preferred Location</p>
                          <p className="text-sm font-semibold text-slate-700">{inquiry.location}</p>
                        </div>
                      </div>

                      {inquiry.message && (
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Additional Notes</p>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {inquiry.message}
                          </p>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (inquiry.email) window.location.href = `mailto:${inquiry.email}`;
                              else if (inquiry.phone || inquiry.contact) window.location.href = `tel:${inquiry.phone || inquiry.contact}`;
                            }}
                          >
                            Contact Lead
                          </Button>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChatbotInquiry(inquiry.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InquiriesManagement;

