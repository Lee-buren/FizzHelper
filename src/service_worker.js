function getRoomData (rid) {
  //  rid 房间号 dt 统计周期 0(今天) 1(昨天) 7(7天内 ) 30(30天)thismonth(本月)
  return fetch('https://www.doseeing.com/xeee/room/aggr', {
    method: 'POST',
    body: `{ "m": "${ btoa(`rid=${ rid }&dt=0`).split('').reverse().join('') }" }`,
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
  });
}

chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message.type === 'roomData') {
    const { data } = await (await getRoomData(message.rid)).json();
    console.log(await chrome.windows.getAll());
    chrome.tabs.sendMessage(sender.tab.id, { type: 'roomData', data });
  }
});
