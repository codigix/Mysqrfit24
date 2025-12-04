import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatBotIconProps {
  onClick: () => void;
}

const ChatBotIcon = ({ onClick }: ChatBotIconProps) => {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="fixed bottom-4 right-4 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg transition-all duration-300 hover:scale-105 z-40"
    >
      <MessageCircle className="h-6 w-6 text-primary-foreground" />
    </Button>
  );
};

export default ChatBotIcon;