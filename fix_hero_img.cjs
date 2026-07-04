const fs = require('fs');

const fix = `
/* ══════════════════════════════════════════════════════════════════════════
   HERO IMAGE SIZE FIX
══════════════════════════════════════════════════════════════════════════ */

.mc2-hero-product-img {
  width: 600px !important;
  max-width: 120%;
  margin-left: -50px; /* Offset it slightly since it's bigger */
}

@media (max-width: 768px) {
  .mc2-hero-product-img { width: 320px !important; margin-left: 0; }
}

@media (max-width: 480px) {
  .mc2-hero-product-img { width: 280px !important; }
}
`;

fs.appendFileSync('src/index.css', fix);
console.log('Appended hero image size fix');
