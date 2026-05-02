const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://wvrtjbprddmsmbrvqndx.supabase.co', 'sb_publishable_u3UC1LMx_MoOYqcKQjjU-A_srfyQb3m');

async function testConnection() {
  // Try inserting a test record to see if table exists
  const { data, error } = await supabase
    .from('prototype_comments')
    .select('*')
    .limit(1);
  
  if (error) {
    console.log('Table does not exist yet. Error:', error.message);
    console.log('\n=== RUN THIS SQL IN SUPABASE DASHBOARD (SQL Editor) ===\n');
    console.log(`CREATE TABLE prototype_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  component_id text NOT NULL,
  comment text NOT NULL,
  status text DEFAULT 'pending',
  page text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE prototype_comments ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts and reads (for prototype)
CREATE POLICY "Allow anonymous read" ON prototype_comments FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON prototype_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous update" ON prototype_comments FOR UPDATE USING (true);`);
  } else {
    console.log('Table exists! Records:', data.length);
  }
}
testConnection();
