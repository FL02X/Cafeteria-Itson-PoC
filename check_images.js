const https = require('https');
const ids = [
  '1520630040775-654dbdb17fa4', // Limonada
  '1583337145455-8d59fa99abf0', // Horchata? 
  '1497534446324-4f056ce85c39', // Jamaica
  '1592415174094-1ac3d02773dc', // Torta de pierna
  '1550815197-047f3b8116ea', // Torta jamon
  '1585802283737-01e4a643bc5d', // Burrito 
  '1505807955342-df8206d20359', // Tacos dorados?
  '1574780512809-5884485eb1a7', // Elote?
  '1559981881-80a9fc6c52a0'    // Hot dog
];

ids.forEach(id => {
  https.get(`https://images.unsplash.com/photo-${id}?w=400&q=80`, (res) => {
    console.log(`${id}: ${res.statusCode}`);
  }).on('error', (e) => {
    console.error(`Error with ${id}: ${e.message}`);
  });
});
