const fs = require('fs');  
const file = 'src/pages/PropertyDetails.tsx';  
const content = fs.readFileSync(file, 'utf8');  
const updated = content.replace(/Accordion type=.single. collapsible/, 'Accordion type=\"multiple\" defaultValue={[\"description\", \"address\", \"details\", \"features\"]}');  
fs.writeFileSync(file, updated);  
