# Todos

## Development

```
npm install
npx knex migrate:latest
npm run dev
```

## zadani
Doplňte do všech vhodných route handlerů odesílání listu todoček přes websockety + implementujte odesílání detailu todočka přes websockety. Detail todočka se bude odesílat vždy při změně todočka. Příklad: v jednom okně prohlížeče otevřu detail todočka A a ve druhém okně prohlížeče todočko A přejmenuju na todočko B. V prvním okně prohlížeče se mi musí změna automaticky projevit. Pozor: změna todočka může probíhat jak z detailu todočka tak i listu todoček + pokud změním todočko C, nesmím přepsat stránku s detailem jiného todočka. Pokud změnu provedu z detailu todočka, budu tedy odesílat dva eventy. Jeden pro detail daného todočka a druhý pro list todoček.
 
Bonusový bod: vyřešte mazání todoček. Například když mám v prohlížeči otevřená detail s todočkem, které z jiného prohlížeče smažu, v prvním prohlížeči se mi místo detailu todočka objeví hláška s informací, že todočko bylo smazáno.