export const messages = [{ 
    messageID: '1', ts: new Date(), text: 'hello', sender: '1337', status: ['2']
}, { 
    messageID: '2', ts: new Date(), text: 'willkomen zuhause soldat!', sender: '2', status: []
}, { 
    messageID: '3', ts: new Date(), text: 'Bitte nicht mehr schreiben', sender: '2', status: [] 
}, { 
    messageID: '4', ts: new Date(), text: `Das feste, dunkle Äußere des Brotes heißt Kruste oder Rinde. Sie enthält Röstaromen, die durch die Maillard-Reaktion beim Backen entstehen. Durch Einschneiden der Brotoberfläche vor dem Backprozess oder durch das zufällig Aufreißen beim Gehen ergeben sich in der Kruste Ausbünde, die die Oberfläche des gebackenen Brotes vergrößern. Die Dicke der Kruste ergibt sich aus der Backdauer, und ihre Farbe ergibt sich aus der Backtemperatur.

    Das weiche, lockere Innere des Brotes ist die Krume. Sie enthält je nach Brotsorte mehr oder weniger Poren mit regelmäßiger oder unregelmäßiger Größe, die beim Gären entstanden sind, und gegebenenfalls weitere Bestandteile, wie zum Beispiel ganze Getreide- oder Saatkörner. Die Krume kann eher luftig und leicht oder aber auch kompakt und saftig sein.
    
    Brotkrümel heißen auch Brosamen (aus dem Mittelhochdeutschen) oder Brösel. Die meisten Brotteige können auch in Form kleinerer, etwa handtellergroßer Portionen als Brötchen gebacken werden.`, 
    sender: '1337', status: ['1']
}, { 
    messageID: '5', ts: new Date(), text: `Das feste, dunkle Äußere des Brotes heißt Kruste oder Rinde. Sie enthält Röstaromen, die durch die Maillard-Reaktion beim Backen entstehen. Durch Einschneiden der Brotoberfläche vor dem Backprozess oder durch das zufällig Aufreißen beim Gehen ergeben sich in der Kruste Ausbünde, die die Oberfläche des gebackenen Brotes vergrößern. Die Dicke der Kruste ergibt sich aus der Backdauer, und ihre Farbe ergibt sich aus der Backtemperatur.

    Das weiche, lockere Innere des Brotes ist die Krume. Sie enthält je nach Brotsorte mehr oder weniger Poren mit regelmäßiger oder unregelmäßiger Größe, die beim Gären entstanden sind, und gegebenenfalls weitere Bestandteile, wie zum Beispiel ganze Getreide- oder Saatkörner. Die Krume kann eher luftig und leicht oder aber auch kompakt und saftig sein.
    
    Brotkrümel heißen auch Brosamen (aus dem Mittelhochdeutschen) oder Brösel. Die meisten Brotteige können auch in Form kleinerer, etwa handtellergroßer Portionen als Brötchen gebacken werden.`, 
    sender: '2', status: []
}, { 
    messageID: '6', ts: new Date(), text: 'Steht das brot angebot noch?', sender: '2', status: [] 
}, { 
    messageID: '6', ts: new Date(), text: `Das feste, dunkle Äußere des Brotes heißt Kruste oder Rinde. Sie enthält Röstaromen, die durch die Maillard-Reaktion beim Backen entstehen. Durch Einschneiden der Brotoberfläche vor dem Backprozess oder durch das zufällig Aufreißen beim Gehen ergeben sich in der Kruste Ausbünde, die die Oberfläche des gebackenen Brotes vergrößern. Die Dicke der Kruste ergibt sich aus der Backdauer, und ihre Farbe ergibt sich aus der Backtemperatur.

    Das weiche, lockere Innere des Brotes ist die Krume. Sie enthält je nach Brotsorte mehr oder weniger Poren mit regelmäßiger oder unregelmäßiger Größe, die beim Gären entstanden sind, und gegebenenfalls weitere Bestandteile, wie zum Beispiel ganze Getreide- oder Saatkörner. Die Krume kann eher luftig und leicht oder aber auch kompakt und saftig sein.
    
    Brotkrümel heißen auch Brosamen (aus dem Mittelhochdeutschen) oder Brösel. Die meisten Brotteige können auch in Form kleinerer, etwa handtellergroßer Portionen als Brötchen gebacken werden.`, 
    sender: '2', status: []
}, { 
    contentID: "8CKX5Mw9I5FIwq3erXY0",
    contentType: "image",
    ts: "Wed Jun 29 2022 14:32:29 GMT+0000 (Coordinated Universal Time)",
    type: "imageMessage",
    messageID: '7', ts: new Date(), text: '', sender: '1', status: []
}];
export const me = { codes: false, id: '1337', nickname: 'Johannes', expire: new Date(), status: 'working' };
export const partner = {
    expire: 'Tue Jul 19 2022 05:33:42 GMT+0000 (Coordinated Universal Time)',
    id: '1',
    nickname: 'Boris',
    sender: '1',
    status: 'Working on something great',
    text: 'Hallo Oli, wolltest du nicht',
    threadID: '1:1337',
    ts: (() => {
        const now = new Date(); 
        now.setTime(now.getTime() - 1000 * 10);
        return now;
    })(),
    type: 'user',
    endless: false
};
export const image = 'data:image/png;base64,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';