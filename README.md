# Instituto Mão Amiga - App de Doações

App em React Native (Expo) para consultar os pontos de coleta e distribuição do Instituto Mão Amiga e registrar doações.

Nesta semana (N1) o app passou a guardar o **histórico completo** de doações: dá para ver, filtrar, editar e excluir, e ainda ver um resumo com os totais por tipo de item.

## Como rodar

```bash
npm install
npm start
```

Depois é só abrir no Expo Go (lendo o QR Code) ou apertar `a` para o emulador Android.

## Estrutura de pastas

```
src/
  components/   componentes reutilizáveis (Botao, CampoTexto, DoacaoItem, ResumoDoacoes...)
  data/         lista fixa dos pontos de coleta
  hooks/        useDoacoes (carrega as doações sempre que a tela ganha foco)
  navigation/   rotas do app (stack)
  screens/      telas
  storage/      doacoesStorage.js -> único arquivo que acessa o AsyncStorage
  theme/        cores e medidas
  utils/        funções puras: validação, filtro, resumo, formatação de data
```

Formato de cada doação salva:

```js
{ id, tipoItem, quantidade, pontoDestino, criadoEm }
```

## Issues

| Issue | Tema | Onde está |
|---|---|---|
| #01 | Carta de abertura e setup do ambiente | `checklist-setup.md` |
| #02 | Repositório pessoal e escopo único | `ficha-observacao.md` |
| #03 | Lista de pontos de coleta | `src/screens/PontosScreen.js` |
| #04 | Navegação lista → detalhe com FlatList e dados ampliados | `src/screens/DetalhePontoScreen.js`, `src/data/pontosColeta.js` |
| #05 | Formulário de cadastro com validação | `src/screens/CadastroDoacaoScreen.js`, `src/utils/validacaoDoacao.js` |
| #06 | Layout responsivo | `src/theme/cores.js` (`larguraMaximaConteudo`), estilos das telas |
| #07 | Persistência local da doação | `src/storage/doacoesStorage.js` |
| #08 | Histórico salvo no aparelho | `src/storage/doacoesStorage.js` |
| #09 | Tela de histórico com FlatList | `src/screens/HistoricoScreen.js`, `src/components/DoacaoItem.js` |
| #10 | Detalhe e exclusão | `src/screens/DetalheDoacaoScreen.js`, `excluirDoacao(id)` |
| #11 | Editar uma doação | `src/screens/CadastroDoacaoScreen.js` (mesmo formulário), `atualizarDoacao(doacao)` |
| #12 | Filtro por tipo de item | `src/utils/filtroDoacoes.js`, `src/components/CampoBusca.js` |
| #13 | Resumo com totais por tipo | `src/utils/resumoDoacoes.js`, `src/components/ResumoDoacoes.js` |
| #14 | Acabamento e roteiro | este README |

## Roteiro de demonstração (até 3 minutos)

1. **Registrar** (30s): na tela inicial, tocar em "Registrar doação". Tentar salvar vazio para mostrar as validações. Preencher "Roupa", quantidade 10, escolher "Sede Centro" e salvar. Registrar mais duas: "Alimento" (30) e "roupa infantil" (5), essa abrindo "Ver pontos de coleta", tocando em "Paróquia São José" e depois em "Doar para este ponto".
2. **Ver o histórico** (20s): voltar e tocar em "Minhas doações". Mostrar a lista (mais recente primeiro) e o resumo no topo com os tipos ordenados pela quantidade.
3. **Filtrar** (20s): digitar "ROUPA" na busca e mostrar que aparecem "Roupa" e "roupa infantil" (não diferencia maiúsculas). Digitar "brinquedo" e mostrar a mensagem de nenhum resultado. Apagar o texto e a lista completa volta.
4. **Editar** (30s): tocar em "Roupa", depois em "Editar doação". Mostrar que o título mudou para "Editar doação" e o formulário veio preenchido. Trocar a quantidade para 15 e salvar. O detalhe já mostra 15, e ao voltar o histórico e o resumo também.
5. **Excluir** (20s): no detalhe de uma doação, tocar em "Excluir doação". Primeiro tocar em "Cancelar" (nada muda), depois excluir de verdade. Volta para o histórico, a doação sumiu e o resumo foi recalculado.
6. **Fechar e reabrir** (20s): fechar o app de verdade (tirar dos recentes) e abrir de novo. Entrar em "Minhas doações": tudo continua lá.

## Testes feitos (Issue #14)

- Telas de histórico, detalhe e edição testadas em **320x568** (celular pequeno), **360x640** e **768x1024** (tablet). No tablet o conteúdo fica centralizado com largura máxima de 600, para não esticar demais.
- Nomes de item muito longos quebram linha em vez de serem cortados com "...".
- Todos os botões, opções de ponto, campos e itens da lista têm pelo menos 44px de altura (botões e campos têm 48px).
- Formulário e busca ficam dentro de um `KeyboardAvoidingView` (componente `TelaComTeclado`), e o formulário fica num `ScrollView`, então o teclado não cobre os campos.

## Decisões técnicas

- **Acesso ao armazenamento num arquivo só (`doacoesStorage.js`)**: as telas não sabem que existe AsyncStorage, só chamam `listarDoacoes`, `salvarDoacao`, `atualizarDoacao` e `excluirDoacao`. Se um dia trocar o AsyncStorage por uma API ou SQLite, só esse arquivo muda. Também evita ter a chave `@maoAmiga:doacoes` espalhada pelo código.
- **Totais calculados e não salvos**: o resumo é calculado a partir do array de doações toda vez que a tela renderiza (`calcularResumo`). Se eu salvasse os totais à parte, teria que lembrar de atualizar eles em todo cadastro, edição e exclusão, e qualquer esquecimento deixaria os números errados. Calculando, o resumo nunca fica desatualizado.
- **Filtro sem segunda lista no estado**: só o texto da busca é estado. A lista filtrada é derivada com `useMemo` a partir do array completo, então não tem como as duas listas ficarem diferentes e o filtro nunca altera o que está salvo.
- **Um formulário para cadastro e edição**: a tela `CadastroDoacao` recebe (ou não) uma doação por `route.params`. Se recebe, entra no modo edição: troca o título, preenche os campos e salva com `atualizarDoacao` mantendo o mesmo `id`. As validações ficam em `validacaoDoacao.js` e valem para os dois casos.
- **`DoacaoItem` com `React.memo`** e `renderItem`/`onPress` com `useCallback`, para a lista não re-renderizar todos os itens a cada letra digitada na busca.
