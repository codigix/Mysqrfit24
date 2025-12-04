import { supabase } from '@/integrations/supabase/client';

export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `properties/${fileName}`;

    // Upload the file
    const { data, error } = await supabase.storage
      .from('property-images')
      .upload(filePath, file);

    if (error) throw error;

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('property-images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteImage = async (url: string): Promise<void> => {
  try {
    // Extract the file path from the URL
    const urlParts = url.split('/');
    const bucketIndex = urlParts.findIndex(part => part === 'property-images');
    if (bucketIndex === -1) return;
    
    const filePath = urlParts.slice(bucketIndex + 1).join('/');
    
    const { error } = await supabase.storage
      .from('property-images')
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};