import { createClient } from '@supabase/supabase-js'

// Create Supabase client
const supabase = createClient('https://gcdzatdsbirirrtxktlj.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjZHphdGRzYmlyaXJydHhrdGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4ODg1NjksImV4cCI6MjA1MzQ2NDU2OX0._jkPv02rqaNiY7eELU2hm59U1uOZJJqLDx-VvHX0SdM')

// Upload file using standard upload
async function uploadFile(file) {
  const { data, error } = await supabase.storage.from('vieshop').upload('product_image', file)
  if (error) {
    console.log(error)
  } else {
    console.log(data)
  }
}

const reader = new FileReader();
reader.readerAsDataURL("alo.jpg");
uploadFile(new file("alo.jpg"));
