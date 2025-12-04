import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Send, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type ChatStep = 'initial' | 'budget' | 'location' | 'contact' | 'completed';
type PropertyType = 'rent' | 'buy' | null;

interface ChatMessage {
  type: 'bot' | 'user';
  content: string;
}

interface ChatBotProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ChatBot = ({ isOpen, onToggle }: ChatBotProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { type: 'bot', content: 'Hi! 👋 I\'m here to help you find your perfect property. Are you looking to rent or buy?' }
  ]);
  const [currentStep, setCurrentStep] = useState<ChatStep>('initial');
  const [propertyType, setPropertyType] = useState<PropertyType>(null);
  const [userInput, setUserInput] = useState('');
  const [userResponses, setUserResponses] = useState({
    budget: '',
    location: '',
    contact: ''
  });

  const addMessage = (type: 'bot' | 'user', content: string) => {
    setMessages(prev => [...prev, { type, content }]);
  };

  const saveInquiry = async () => {
    try {
      const { error } = await supabase
        .from('chatbot_inquiries')
        .insert({
          property_type: propertyType!,
          budget: userResponses.budget,
          location: userResponses.location,
          contact: userResponses.contact
        });

      if (error) {
        console.error('Error saving inquiry:', error);
        toast({
          title: "Error",
          description: "Failed to save your inquiry. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Your inquiry has been saved successfully!",
        });
      }
    } catch (error) {
      console.error('Error saving inquiry:', error);
      toast({
        title: "Error", 
        description: "Failed to save your inquiry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePropertyTypeSelect = (type: 'rent' | 'buy') => {
    setPropertyType(type);
    addMessage('user', type === 'rent' ? 'Rent' : 'Buy');
    
    const response = type === 'rent' 
      ? "Great! You're looking to rent. 💬 What is your monthly budget range?"
      : "Great! You're looking to buy. 💬 What is your property budget range? (e.g., ₹30 Lakhs – ₹60 Lakhs)";
    
    addMessage('bot', response);
    setCurrentStep('budget');
  };

  const handleUserResponse = async () => {
    if (!userInput.trim()) return;

    addMessage('user', userInput);

    switch (currentStep) {
      case 'budget':
        setUserResponses(prev => ({ ...prev, budget: userInput }));
        addMessage('bot', '💬 Which area or location do you prefer?');
        setCurrentStep('location');
        break;
      
      case 'location':
        setUserResponses(prev => ({ ...prev, location: userInput }));
        addMessage('bot', '💬 Can I have your contact number so our team can share matching properties with you?');
        setCurrentStep('contact');
        break;
      
      case 'contact':
        setUserResponses(prev => ({ ...prev, contact: userInput }));
        const finalMessage = propertyType === 'rent'
          ? "✅ Thank you! Our team will connect with you shortly with the best rental options."
          : "✅ Thank you! Our team will connect with you shortly with the best properties to buy.";
        addMessage('bot', finalMessage);
        setCurrentStep('completed');
        
        // Save the inquiry to database
        await saveInquiry();
        break;
    }

    setUserInput('');
  };

  const resetChat = () => {
    setMessages([
      { type: 'bot', content: 'Hi! 👋 I\'m here to help you find your perfect property. Are you looking to rent or buy?' }
    ]);
    setCurrentStep('initial');
    setPropertyType(null);
    setUserInput('');
    setUserResponses({ budget: '', location: '', contact: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-4 w-80 h-96 bg-card border border-border rounded-lg shadow-lg flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <span className="font-semibold">Property Assistant</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onToggle}
          className="text-primary-foreground hover:bg-primary-foreground/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              'flex',
              message.type === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[80%] p-3 rounded-lg text-sm',
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        {currentStep === 'initial' && (
          <div className="space-y-2">
            <Button 
              onClick={() => handlePropertyTypeSelect('rent')}
              className="w-full"
              variant="outline"
            >
              Rent
            </Button>
            <Button 
              onClick={() => handlePropertyTypeSelect('buy')}
              className="w-full"
              variant="outline"
            >
              Buy
            </Button>
          </div>
        )}

        {currentStep !== 'initial' && currentStep !== 'completed' && (
          <div className="flex gap-2">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your response..."
              onKeyPress={(e) => e.key === 'Enter' && handleUserResponse()}
              className="flex-1"
            />
            <Button onClick={handleUserResponse} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}

        {currentStep === 'completed' && (
          <Button onClick={resetChat} className="w-full" variant="outline">
            Start New Conversation
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatBot;