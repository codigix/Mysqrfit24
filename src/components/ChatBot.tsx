import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Send, MessageCircle, RefreshCw } from 'lucide-react';
import { apiService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

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
  const scrollRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (type: 'bot' | 'user', content: string) => {
    setMessages(prev => [...prev, { type, content }]);
  };

  const saveInquiry = async (finalResponses: typeof userResponses) => {
    try {
      if (!propertyType || !finalResponses.location) {
        console.error('Missing required fields:', { propertyType, location: finalResponses.location });
        return;
      }

      await apiService.chatbot.createInquiry({
        property_type: propertyType,
        budget: finalResponses.budget,
        location: finalResponses.location,
        contact: finalResponses.contact
      });

      toast({
        title: "Success",
        description: "Your inquiry has been saved successfully!",
      });
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

    const currentInput = userInput.trim();
    addMessage('user', currentInput);
    setUserInput('');

    const updatedResponses = { ...userResponses };

    switch (currentStep) {
      case 'budget':
        updatedResponses.budget = currentInput;
        setUserResponses(prev => ({ ...prev, budget: currentInput }));
        addMessage('bot', '💬 Which area or location do you prefer?');
        setCurrentStep('location');
        break;
      
      case 'location':
        updatedResponses.location = currentInput;
        setUserResponses(prev => ({ ...prev, location: currentInput }));
        addMessage('bot', '💬 Can I have your contact number so our team can share matching properties with you?');
        setCurrentStep('contact');
        break;
      
      case 'contact': {
        updatedResponses.contact = currentInput;
        setUserResponses(prev => ({ ...prev, contact: currentInput }));
        const finalMessage = propertyType === 'rent'
          ? "✅ Thank you! Our team will connect with you shortly with the best rental options."
          : "✅ Thank you! Our team will connect with you shortly with the best properties to buy.";
        addMessage('bot', finalMessage);
        setCurrentStep('completed');
        
        // Save the inquiry to database with updated values
        await saveInquiry(updatedResponses);
        break;
      }
    }
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
    <div className="fixed bottom-24 right-4 w-80 h-[28rem] border border-border rounded-lg shadow-lg flex flex-col z-50 bg-background overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <span className="font-semibold">Property Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={resetChat}
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            title="Reset Chat"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggle}
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-4"
      >
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
                'max-w-[80%] p-3 rounded-lg text-sm shadow-sm',
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-none'
                  : 'bg-muted text-muted-foreground rounded-tl-none'
              )}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-muted/50">
        {currentStep === 'initial' && (
          <div className="grid grid-cols-2 gap-2">
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
              className="flex-1 bg-background"
            />
            <Button onClick={handleUserResponse} size="icon">
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
