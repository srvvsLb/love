# ❤️ Presente de Aniversário – Juliane

Site romântico interativo com chuva de corações, contagem regressiva, cartinha de amor e galeria de fotos em formato de coração.

## O que tem de especial

- Fundo vermelho romântico profundo
- Chuva de corações desenhada (não emoji) com brilho e interação
- Os corações se afastam do dedo/mouse
- Clique ou toque cria explosão de corações
- Cartinha com mensagem romântica personalizada
- Galeria em formato de coração
- **Lugares reservados para fotos**: se a foto não existir, aparece um placeholder bonito
- Clique em qualquer foto (ou placeholder) abre um lightbox romântico com legenda
- Sequência cinematográfica suave
- Funciona muito bem no celular
- Conflitos de clique/toque resolvidos (botões e envelope não competem com a chuva)

## Como usar

1. Coloque as fotos dela na pasta `assets/fotos/`
   - Nomeie: `foto1.jpg`, `foto2.jpg`, `foto3.jpg` ... até `foto10.jpg`
   - Recomendado: fotos quadradas ou retrato

2. (Opcional) Edite as legendas românticas no arquivo `script.js` (array `LEGENDAS`)

3. Abra o `index.html` no navegador (duplo clique ou Live Server)

## Personalização rápida

| O que mudar              | Onde                                      |
|--------------------------|-------------------------------------------|
| Nome dela                | `const NOME = "Juliane";` no `script.js`  |
| Mensagem da cartinha     | Dentro de `.message` no `index.html`      |
| Quantidade de fotos      | Array `FOTOS` no `script.js`              |
| Legendas ao clicar       | Array `LEGENDAS` no `script.js`           |
| Texto final              | Dentro de `#final` no `index.html`        |

## Dica

Hospede no Vercel, Netlify ou GitHub Pages e gere um QR Code. Ela abre no celular e a interação fica ainda mais mágica.
