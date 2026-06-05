# Como Configurar Planilhas do Google Sheets

## 1. Criar uma Planilha Pública

1. Acesse [Google Sheets](https://sheets.google.com)
2. Clique em "Nova planilha"
3. Adicione dados nas colunas A até G:
   - **Coluna A**: timestamp (data/hora)
   - **Coluna B**: playerName (nome do jogador)
   - **Coluna C**: mainTeam (time principal)
   - **Coluna D**: mainTeamPower (poder do time)
   - **Coluna E**: bestTime (melhor tempo)
   - **Coluna F**: thp (THP)
   - **Coluna G**: professionLevel (nível profissional)

## 2. Compartilhar a Planilha

1. Clique em **"Compartilhar"** (canto superior direito)
2. Mude para **"Qualquer pessoa com o link pode visualizar"**
3. Copie o link da planilha

## 3. Extrair o ID da Planilha

A URL será assim:
```
https://docs.google.com/spreadsheets/d/[ID_AQUI]/edit#gid=0
```

Copie apenas a parte `[ID_AQUI]`

## 4. Atualizar a Configuração

Edite `src/app/features/dashboard/sheet.config.ts` e substitua:
```typescript
sheetId: 'SEU_SHEET_ID_AQUI'
```

Para seu ID, por exemplo:
```typescript
sheetId: '1BxiMVs0XRA5nFMXT3pdLiWdtnCEWMlFhFv2-3eV_cCI'
```

## 5. Testar

- Faça login na aplicação (admin / admin123)
- Navegue pelas abas
- Clique em "Recarregar" para buscar os dados

## Troubleshooting

**Erro 404**: A planilha não está pública ou o ID está incorreto
- Verifique se compartilhada com "Qualquer pessoa com o link"
- Copie o ID correto da URL

**Nenhum dato aparece**: Verifique se:
- Os dados estão nas colunas A-G
- Primeira linha tem headers (ou dados começam na linha 2)
- A planilha está compartilhada publicamente

**Erro de CORS**: Isso não deve acontecer com Google Sheets, mas se ocorrer:
- Verifique a URL no console do navegador
- Confirme que a planilha está compartilhada
