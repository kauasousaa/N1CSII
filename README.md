# Instituto Mão Amiga - App de Doações

App em React Native (Expo) para consultar os pontos de coleta e distribuição do Instituto Mão Amiga e registrar doações.

Na N1 o histórico de doações ficava no celular. Na N2, pontos e doações vêm da API. Só os pontos favoritos continuam no aparelho.

## Como rodar

```bash
npm install
npm start
```

Depois é só abrir no Expo Go (lendo o QR Code) ou apertar `a` para o emulador Android. O projeto usa o **Expo SDK 58**, então o Expo Go do celular precisa ser da versão do SDK 58.

A API fica em um repositório separado: [mao-amiga-api](https://github.com/kauasousaa/mao-amiga-api), na pasta `C:\WorkKaua\mao-amiga-api`. Ela precisa de **Java 17**. Na pasta da API:

```bash
mvnw.cmd spring-boot:run
```

A URL do servidor está só em `src/services/api.ts` (`http://192.168.1.2:8080`). É o IP do computador na rede local, não `localhost`, para o celular alcançar a API. Se o IP mudar, troque esse valor nesse arquivo. Celular e computador precisam estar na mesma rede.

## N2-3 — pontos vindos da API

A lista de pontos não usa mais o array fixo. `PontosScreen` pede páginas em `GET /api/v1/pontos/filtro`, com rolagem infinita, e a busca volta para a primeira página. O detalhe recebe só o `id` e busca o ponto na API. Se o id não existir, a tela mostra "ponto não encontrado". Se a API estiver desligada, a lista mostra uma mensagem de erro e o botão "Tentar de novo".

## N2-4 — cadastrar, editar e excluir pontos

O formulário fica em `CadastroPontoScreen` e serve para os dois casos. No cadastro, o botão envia `POST`. Na edição, o mesmo formulário abre preenchido e o botão "Salvar alterações" envia `PUT`. O tipo é escolhido entre coleta e distribuição. Campo vazio não sai do aparelho. Se a API recusar ou estiver desligada, a mensagem aparece e o que foi digitado permanece.

Excluir pede confirmação com Cancelar e Excluir. Confirmar envia `DELETE` e o ponto sai da lista. A lista recarrega ao voltar para ela, então o ponto novo ou editado aparece sem fechar o app. O detalhe busca de novo pelo id e mostra os valores novos.

## N2-6 e N2-7 — doações pela API

O cadastro, o histórico, a edição e a exclusão de doações usam a API. `src/services/doacoesService.ts` lista a página com filtro, busca por id, cadastra, edita e exclui, sempre pelo `api.ts`. Nenhuma tela guarda doação no AsyncStorage.

O ponto de destino é um `TouchableOpacity` por ponto vindo de `GET /api/v1/pontos`. Só aparecem os pontos de coleta, porque os de distribuição não recebem doação. O escolhido fica destacado e a API recebe o nome do ponto. O histórico é uma `FlatList` com `keyExtractor` pelo id, rolagem infinita e filtro de tipo feito na API. Doação nova aparece no topo ao voltar para o histórico. Carregando, erro de API desligada e lista vazia têm mensagens diferentes. Se a API recusar ou estiver desligada, o formulário mostra o aviso e mantém o que foi digitado.

O detalhe da doação recebe só o id e busca na API. Doação inexistente mostra "doação não encontrada". Editar reabre o mesmo formulário, já preenchido, com o botão "Salvar alterações". O `PUT` mantém o id e a data de cadastro. Excluir pede Cancelar ou Excluir; confirmar envia `DELETE` e a doação sai do histórico.

## N2-8 — pontos favoritos

Cada ponto da lista tem um botão ♡ / ♥ com área de toque de 44x44. Os favoritos ficam no AsyncStorage só com o id, em `src/storage/favoritosStorage.js`, e continuam depois de fechar o app. A tela "Meus pontos" busca cada id na API. Sem favoritos, a tela avisa que está vazia. Ponto excluído fica de fora sem quebrar a tela. O botão "Desfavoritar" tira o ponto na hora e atualiza o AsyncStorage.

Favoritos ficam no aparelho porque são uma preferência de quem está usando o celular. Pontos e doações ficam no servidor porque são os dados do instituto, compartilhados entre os aparelhos.

## Estrutura de pastas

```
src/
  components/   componentes reutilizáveis (Botao, CampoTexto, DoacaoItem, PontoItem, SeletorPonto...)
  services/     api.ts (único fetch), pontosService.ts e doacoesService.ts
  navigation/   rotas do app (stack)
  screens/      telas
  storage/      favoritosStorage.js -> AsyncStorage só com os ids dos pontos favoritos
  theme/        cores e medidas
  utils/        funções puras: validação de ponto e de doação, formatação de data
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
| #04 | Navegação lista → detalhe com FlatList e dados ampliados | `src/screens/DetalhePontoScreen.js` (a lista fixa saiu na N2-3) |
| #05 | Formulário de cadastro com validação | `src/screens/CadastroDoacaoScreen.js`, `src/utils/validacaoDoacao.js` |
| #06 | Layout responsivo | `src/theme/cores.js` (`larguraMaximaConteudo`), estilos das telas |
| #07 | Persistência local da doação | saiu na N2-6; doações foram para a API |
| #08 | Histórico salvo no aparelho | saiu na N2-6; o histórico vem de `doacoesService.ts` |
| #09 | Tela de histórico com FlatList | `src/screens/HistoricoScreen.js`, `src/components/DoacaoItem.js` |
| #10 | Detalhe e exclusão | `src/screens/DetalheDoacaoScreen.js`, `excluir(id)` em `doacoesService.ts` |
| #11 | Editar uma doação | `src/screens/CadastroDoacaoScreen.js` (mesmo formulário), `editar(id, dados)` em `doacoesService.ts` |
| #12 | Filtro por tipo de item | na N2-6 o filtro passou para a API; `src/components/CampoBusca.js` envia o texto |
| #13 | Resumo com totais por tipo | saiu na N2-6, como o PDF permite; a Home mostra a última doação e o total |
| #14 | Acabamento e roteiro | este README |

## Roteiro de demonstração (até 3 minutos)

1. **Buscar um ponto** (20s): em "Ver pontos de coleta", digitar um bairro e mostrar a lista vinda da API.
2. **Cadastrar, editar e excluir um ponto** (50s): cadastrar um ponto, abrir o detalhe, salvar uma alteração e excluir com confirmação. A lista acompanha cada passo.
3. **Favoritar** (20s): na lista, tocar no ♡. Abrir "Meus pontos", mostrar o ponto e desfavoritar.
4. **Cadastrar, editar e excluir uma doação** (50s): registrar uma doação escolhendo um ponto da API. No histórico ela aparece no topo. Abrir o detalhe, salvar uma alteração e excluir.
5. **400 e 404 na API** (40s): no Swagger, enviar uma doação com quantidade 0 (400) e buscar um id que não existe (404).

## Testes feitos (Issue #14)

- Telas de histórico, detalhe e edição testadas em **320x568** (celular pequeno), **360x640** e **768x1024** (tablet). No tablet o conteúdo fica centralizado com largura máxima de 600, para não esticar demais.
- Nomes de item muito longos quebram linha em vez de serem cortados com "...".
- Todos os botões, opções de ponto, campos e itens da lista têm pelo menos 44px de altura (botões e campos têm 48px).
- Formulário e busca ficam dentro de um `KeyboardAvoidingView` (componente `TelaComTeclado`), e o formulário fica num `ScrollView`, então o teclado não cobre os campos.

## Decisões técnicas

- **Favoritos no aparelho, pontos e doações no servidor**: o favorito é uma preferência de quem usa aquele celular, então fica no AsyncStorage, só com o id. Ponto e doação são dados do instituto e ficam na API, no H2, para qualquer aparelho ver a mesma lista.
- **Filtro e paginação no servidor**: com rolagem infinita o app só tem algumas páginas na memória, então filtrar no aparelho deixaria de fora o que ainda não foi carregado. Por isso o texto da busca vai para a API, e cada busca volta para a primeira página.
- **Só `api.ts` chama `fetch`**: a URL do servidor fica num lugar só, e os services montam os caminhos. As telas não sabem nada de HTTP, só tratam o `ErroApi` com o status (404 vira "não encontrado", 400 vira "dados recusados").
- **Um formulário para cadastro e edição**: as telas `CadastroPonto` e `CadastroDoacao` recebem (ou não) o item por `route.params`. Se recebem, entram no modo edição: trocam o título, preenchem os campos, mostram "Salvar alterações" e enviam `PUT` mantendo o mesmo `id`. A data de cadastro da doação é do servidor e não muda na edição.
- **`DoacaoItem` com `React.memo`** e `renderItem`/`onPress` com `useCallback`, para a lista não re-renderizar todos os itens a cada letra digitada na busca.
