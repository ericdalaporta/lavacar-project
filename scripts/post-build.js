/**
 * Script pós-build para Angular 19
 * Move arquivos da pasta 'browser' para 'docs' e delete a pasta vazia
 * Necessário para GitHub Pages funcionar corretamente
 */

const fs = require('fs');
const path = require('path');

const docsPath = path.join(__dirname, '../docs');
const browserPath = path.join(docsPath, 'browser');

console.log('🔧 Executando script pós-build...');

// Verificar se a pasta browser existe
if (fs.existsSync(browserPath)) {
  console.log(`📁 Movendo arquivos de ${browserPath} para ${docsPath}...`);
  
  try {
    // Listar todos os arquivos em browser
    const files = fs.readdirSync(browserPath);
    
    files.forEach((file) => {
      const srcPath = path.join(browserPath, file);
      const destPath = path.join(docsPath, file);
      
      // Se arquivo com mesmo nome existe em docs, deletar primeiro
      if (fs.existsSync(destPath)) {
        if (fs.statSync(destPath).isDirectory()) {
          // Se é pasta, remover recursivamente
          fs.rmSync(destPath, { recursive: true, force: true });
        } else {
          // Se é arquivo, apenas deletar
          fs.unlinkSync(destPath);
        }
      }
      
      // Mover arquivo
      fs.renameSync(srcPath, destPath);
      console.log(`  ✅ ${file}`);
    });
    
    // Deletar pasta browser vazia
    fs.rmdirSync(browserPath);
    console.log(`✨ Pasta 'browser' removida com sucesso!`);
    console.log(`🚀 Build pronto para GitHub Pages!`);
  } catch (error) {
    console.error(`❌ Erro ao mover arquivos:`, error);
    process.exit(1);
  }
} else {
  console.log(`⚠️  Pasta 'browser' não encontrada em ${browserPath}`);
}
