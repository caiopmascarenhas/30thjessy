# 30th Jessy

Experiência responsiva de aniversário construída em React + Vite + TypeScript, sem biblioteca de UI, animação, roteamento ou datas. A interface, os efeitos e as animações usam apenas React, APIs nativas do navegador, Canvas, SVG e Web Animations API.

## Rodar o projeto

```bash
yarn
yarn dev
```

Para validar:

```bash
yarn lint
yarn build
```

## Conteúdo das 30 telas

Os textos ficam em dois arquivos:

- `src/content/messages.mock.json`: textos de demonstração para as 30 telas.
- `src/content/messages.official.json`: textos oficiais.

A estrutura é:

```json
{
  "1": {
    "text": "Seu texto oficial aqui"
  }
}
```

Quando `text` no arquivo oficial estiver preenchido, ele substitui automaticamente o mock daquele mesmo número. Se estiver vazio, o projeto usa o mock. Durante `yarn dev`, a alteração do JSON é refletida pelo HMR do Vite; em produção, qualquer alteração de arquivo-fonte exige novo build/deploy.

## Liberação das telas

A agenda está centralizada em `src/config/birthday.config.ts`.

- Capítulos 1 a 29: liberados progressivamente entre 10 e 13 de agosto de 2026.
- Capítulo 30: `14/08/2026 00:00`, horário de Brasília (`2026-08-14T03:00:00.000Z`).

Os timestamps são absolutos, evitando diferença de fuso na lógica de comparação. A interface formata as datas em `America/Sao_Paulo`.

## Senha

A validação usa SHA-256 via Web Crypto API. O projeto não guarda a senha em texto puro no código; guarda apenas o hash em `src/config/birthday.consts.ts`.

Como toda aplicação 100% client-side, essa proteção é uma barreira de experiência, não uma autenticação de segurança. Quem tiver acesso ao código ou manipular o relógio do dispositivo pode contornar restrições. Para bloqueio realmente seguro por data/senha seria necessário validar em um servidor.

## WhatsApp da tela 30

O número fica em `src/config/birthday.consts.ts`. A tela final cria a URL com `encodeURIComponent` e redireciona para `wa.me` somente após existir um desejo preenchido.

## Estrutura

```text
src/
  components/
    AmbientCanvas/
    Button/
    Countdown/
    GoldDivider/
    MomentArtwork/
    ProgressConstellation/
    ScreenShell/
    Typography/
  config/
  content/
  hooks/
  navigation/
  screens/
    AccessScreen/
    HomeScreen/
    MomentScreen/
    FinaleScreen/
  theme/
  utils/
```

Os estilos de componentes ficam em `*.styles.ts`. Não há `App.css`, `index.css`, CSS Modules ou biblioteca de estilos.

## Responsividade e movimento

A responsividade é calculada por `useViewport` e complementada por propriedades fluidas como `clamp()`, grid e medidas relativas. O projeto considera web, tablet e mobile e usa `100dvh` para se comportar melhor com barras móveis.

As animações de entrada usam a Web Animations API; os fundos usam Canvas com `requestAnimationFrame`. `useReducedMotion` lê `prefers-reduced-motion` com `matchMedia()` e reduz movimentos decorativos quando o sistema solicita.

## Modo de teste das liberações

A regra oficial de datas continua ativa normalmente. Para testar todas as 30 telas antes das datas de liberação, adicione o parâmetro abaixo à URL:

```text
?preview=liberar30
```

Exemplo local:

```text
http://localhost:5173/?preview=liberar30
```

O parâmetro libera somente a regra de progresso/data. A tela de senha continua funcionando normalmente. Removendo o parâmetro da URL, o projeto volta imediatamente a respeitar as datas oficiais configuradas.

## Música e animação reativa

A experiência usa `public/audio/golden-hour-instrumental.mp3` como trilha sonora. O player é implementado somente com APIs nativas do navegador (`HTMLAudioElement` + Web Audio API), sem bibliotecas externas.

- A música tenta iniciar após a autenticação; se o navegador bloquear autoplay com áudio, o controle flutuante permite iniciar manualmente.
- O botão flutuante permite pausar e continuar de onde parou.
- A faixa usa `loop`, portanto reinicia automaticamente ao terminar.
- `AnalyserNode` mede energia, graves, médios e agudos em tempo real. O `AmbientCanvas` e as artes dos capítulos usam esses níveis para reagir à música.
- `prefers-reduced-motion` continua sendo respeitado.

## Animações dos 30 capítulos

Cada capítulo possui uma composição SVG própria; não há repetição de arte entre os 30 capítulos. As animações usam três camadas leves por card e um único scheduler compartilhado com a música. O Web Audio API é amostrado em frequência menor que o render visual, enquanto a interpolação continua no `requestAnimationFrame`, reduzindo custo sem perder fluidez. O canvas ambiente também é renderizado em resolução interna reduzida para evitar travamentos em telas Retina/4K.
