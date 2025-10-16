# 🛠️ GUIA: Como Usar os Diagramas em Código

Você tem 4 arquivos de diagrama prontos! Aqui está como usar cada um.

---

## 📊 OPÇÃO 1: MERMAID (Recomendado - Mais Fácil)

### Arquivos:
- `DIAGRAMA_CASOS_USO_MERMAID.md` - Casos de uso
- `DIAGRAMA_CLASSES_MERMAID.md` - Classes

### Método A: Usar Online (Sem Instalar Nada)

**Diagrama de Casos de Uso:**
1. Abra: https://mermaid.live
2. Abra o arquivo: `DIAGRAMA_CASOS_USO_MERMAID.md`
3. Copie o código entre os ``` markers
4. Cole em mermaid.live
5. Clique em "Export" → "Download PNG/SVG"

**Diagrama de Classes:**
1. Mesmo processo, mas com: `DIAGRAMA_CLASSES_MERMAID.md`

### Método B: Usar em VS Code

**Passo 1:** Instale a extensão
```
Extensão: Markdown Preview Mermaid Support
ID: bierner.markdown-mermaid
```

**Passo 2:** Abra o arquivo `.md` em VS Code

**Passo 3:** Abra preview
```
Ctrl+Shift+V (Windows)
ou
Cmd+Shift+V (Mac)
```

**Passo 4:** A imagem aparece no lado direito
- Clique com botão direito
- "Open in External Application" ou "Export PNG"

### Método C: Usar no GitHub

1. Faça commit desses arquivos `.md` no GitHub
2. O GitHub renderiza automaticamente os diagramas Mermaid
3. Você vê a imagem direto no repositório

### Cores Mermaid:
```
#c8e6c9 = Verde (Cliente)
#fff9c4 = Amarelo (Funcionário)
#f8bbd0 = Rosa (Admin)
#e1f5ff = Azul claro
#fff3e0 = Laranja claro
#f3e5f5 = Roxo claro
```

---

## 🎨 OPÇÃO 2: PLANTUML (Mais Profissional)

### Arquivos:
- `DIAGRAMA_CASOS_USO_PLANTUML.puml` - Casos de uso
- `DIAGRAMA_CLASSES_PLANTUML.puml` - Classes

### Método A: Usar Online (PlantUML)

**Diagrama de Casos de Uso:**
1. Acesse: http://www.plantuml.com/plantuml/uml/
2. Abra o arquivo: `DIAGRAMA_CASOS_USO_PLANTUML.puml`
3. Copie TODO o código
4. Cole no site do PlantUML
5. Clique em "Submit" e depois "Download"

**Diagrama de Classes:**
1. Mesmo processo com: `DIAGRAMA_CLASSES_PLANTUML.puml`

### Método B: Usar em VS Code

**Passo 1:** Instale a extensão
```
Extensão: PlantUML
ID: jebbs.plantuml
```

**Passo 2:** Instale Graphviz (necessário)
```
Windows:
- Baixe em: https://graphviz.org/download/
- Instale normalmente
- Reinicie VS Code

Mac:
brew install graphviz

Linux:
sudo apt-get install graphviz
```

**Passo 3:** Abra o arquivo `.puml` em VS Code

**Passo 4:** Visualize
```
Alt+D (Windows)
ou
Cmd+D (Mac)
```

**Passo 5:** Exporte
- Clique com botão direito no diagrama
- "Export Current Diagram" → PNG ou SVG

### Método C: Docker (Se preferir)
```bash
docker run --rm -v %cd%:/data plantuml/plantuml DIAGRAMA_CLASSES_PLANTUML.puml
```

---

## 🆚 COMPARAÇÃO

| Aspecto | Mermaid | PlantUML |
|---------|---------|----------|
| **Fácil de usar** | ✅ Sim | ⚠️ Requer Graphviz |
| **Online** | ✅ mermaid.live | ✅ plantuml.com |
| **GitHub** | ✅ Renderiza automaticamente | ❌ Precisa de extensão |
| **Customização** | ⚠️ Média | ✅ Muito |
| **Qualidade** | ✅ Boa | ✅ Excelente |
| **Curva aprendizado** | ✅ Rápida | ⚠️ Média |

---

## 🚀 RECOMENDAÇÃO RÁPIDA

**Para iniciante:** Use Mermaid online → https://mermaid.live
**Para profissional:** Use PlantUML com VS Code
**Para GitHub:** Coloque o `.md` Mermaid no repo

---

## 📋 CHECKLIST

Antes de fazer push ao GitHub:

- [ ] Escolhi Mermaid ou PlantUML
- [ ] Testei o diagrama em um editor online
- [ ] Exportei como PNG
- [ ] Adicionei a imagem ao README (opcional)
- [ ] Fiz commit do código do diagrama (`.md` ou `.puml`)
- [ ] Fiz push ao GitHub
- [ ] Verifiquei que o diagrama aparece no GitHub

---

## 🎓 EXEMPLOS DE USO

### Adicionar ao README.md:

```markdown
## 🎯 Arquitetura

### Diagrama de Casos de Uso

```mermaid
[Cole aqui o conteúdo entre os ``` do arquivo DIAGRAMA_CASOS_USO_MERMAID.md]
```

### Diagrama de Classes

```mermaid
[Cole aqui o conteúdo entre os ``` do arquivo DIAGRAMA_CLASSES_MERMAID.md]
```
```

Quando você fizer push no GitHub, os diagramas aparecerão automaticamente renderizados! 🎉

---

## ❓ FAQ

**P: Posso editar os diagramas?**
R: Sim! O código é simples. Abra os arquivos `.md` ou `.puml` e modifique.

**P: Qual é melhor, Mermaid ou PlantUML?**
R: Mermaid é mais fácil, PlantUML é mais profissional.

**P: Os diagramas funcionam offline?**
R: Mermaid em VS Code sim (com extensão). PlantUML precisa de Graphviz instalado.

**P: Posso usar em apresentações?**
R: Sim! Exporte como PNG/SVG e adicione em qualquer programa.

**P: E se eu quiser mudar o diagrama depois?**
R: Edite o código no arquivo `.md` ou `.puml` e a imagem se atualiza automaticamente no editor.

---

## 💾 PRÓXIMAS AÇÕES

1. Escolha Mermaid (fácil) ou PlantUML (profissional)
2. Acesse o site correspondente
3. Cole o código
4. Exporte como PNG
5. Adicione ao seu README
6. Faça push no GitHub

Pronto! Seus diagramas estarão públicos e profissionais! 🚀

