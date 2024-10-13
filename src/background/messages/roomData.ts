import type { PlasmoMessaging } from '@plasmohq/messaging';

const RoomData: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { rid } = req.body;
  try {
    //  rid 房间号 dt 统计周期 0(今天) 1(昨天) 7(7天内 ) 30(30天)thismonth(本月)
    const fetchRes = await fetch('https://www.doseeing.com/xeee/room/aggr', {
      method: 'POST',
      body: `{ "m": "${btoa(`rid=${rid}&dt=0`).split('').reverse().join('')}" }`,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    });
    const { data } = await fetchRes.json();
    res.send({ roomData: data });
  } catch (e) {
    res.send({ error: e.message });
  }
};

export default RoomData;
