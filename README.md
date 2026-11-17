# Vehicles App

Painel de gestão de frota em **Angular 22** (projeto pessoal de aprendizagem), com API mock em JSON Server.

## O que tem
- Lista de veículos com **pesquisa** (debounce + `switchMap`) e filtro por estado
- **Detalhe**, **criar** e **editar** (Reactive Forms com validação)
- Rotas com **guard** e **lazy loading**
- Estado numa **NgRx SignalStore**
- **Angular Material**, `OnPush`, testes com Vitest (19 testes)

## Como correr
```bash
npm install
npm run api      # terminal 1: API mock em http://localhost:3000
npm start        # terminal 2: app em http://localhost:4200
npm test
```

## Decisões
- **SignalStore** em vez de NgRx Store clássico: o estado é de uma só feature, não precisa de actions/reducers.
- **`switchMap`** na pesquisa: cancela o pedido anterior.
- **Lazy loading** do detalhe, do formulário e do login.
- Estado **imutável** + `OnPush`.

## Próximo passo
Trocar o JSON Server por uma API Spring Boot.
