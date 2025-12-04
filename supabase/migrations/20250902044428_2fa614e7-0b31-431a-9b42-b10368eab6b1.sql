-- Create table for chatbot inquiries
CREATE TABLE public.chatbot_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_type TEXT NOT NULL CHECK (property_type IN ('rent', 'buy')),
  budget TEXT NOT NULL,
  location TEXT NOT NULL,
  contact TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chatbot_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing inquiries (public access for now since no auth is implemented)
CREATE POLICY "Inquiries are viewable by everyone" 
ON public.chatbot_inquiries 
FOR SELECT 
USING (true);

-- Create policy for inserting inquiries
CREATE POLICY "Anyone can create inquiries" 
ON public.chatbot_inquiries 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_chatbot_inquiries_updated_at
BEFORE UPDATE ON public.chatbot_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();