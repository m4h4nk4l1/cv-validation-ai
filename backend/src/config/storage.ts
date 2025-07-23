import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export const storageBucket = 'cv-uploads';

export const uploadToStorage = async (file: Buffer, fileName: string): Promise<string> => {
  try {
    const { data, error } = await supabase.storage
      .from(storageBucket)
      .upload(fileName, file, {
        contentType: 'application/pdf',
        cacheControl: '3600'
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    const { data: urlData } = supabase.storage
      .from(storageBucket)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Storage upload error:', error);
    throw new Error('Failed to upload file to storage');
  }
};

export const deleteFromStorage = async (fileName: string): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from(storageBucket)
      .remove([fileName]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error('Storage delete error:', error);
    throw new Error('Failed to delete file from storage');
  }
}; 