import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'src/data/mockDatabase.js');
let content = fs.readFileSync(filePath, 'utf8');

//Add icons to each category
const updates = [
  { id: 'restaurant', icon: '🍽️' },
  { id: 'retail', icon: '🛍️' },
  { id: 'salon', icon: '💇' },
  { id: 'gym', icon: '💪' },
  { id: 'medical', icon: '🏥' },
  { id: 'education', icon: '📚' },
  { id: 'professional', icon: '💼' },
  { id: 'automotive', icon: '🚗' },
  { id: 'hotel', icon: '🏨' }
];

updates.forEach(({ id, icon }) => {
  const regex = new RegExp(`({ id: '${id}',[^}]+)(})`, 'g');
  content = content.replace(regex, `$1, icon: '${icon}' }`);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Icons added successfully!');
