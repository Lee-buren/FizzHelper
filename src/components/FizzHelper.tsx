import { sendToBackground } from '@plasmohq/messaging';
import { useStorage } from '@plasmohq/storage/dist/hook';
import { useClickAway, useUpdateEffect } from 'ahooks';
import { useState } from 'react';
import Btn from 'react:../../assets/Btn.svg';
import { formatPrice, getDomAsync, getRid } from '~utils/tools';

export interface Config {
  fullPageAuto: boolean;
  headerSimplify: boolean;
  pageSimplify: boolean;
  barrageHover: boolean;
  barrageSimplify: boolean;
  giftSimplify: boolean;
  chatSimplify: boolean;
  nameplateHide: boolean;
  roomDataShow: boolean;
  blackMode: boolean;
}

export const defaultConfig: Config = {
  fullPageAuto: false,
  headerSimplify: true,
  pageSimplify: true,
  barrageHover: false,
  barrageSimplify: true,
  giftSimplify: false,
  chatSimplify: true,
  nameplateHide: false,
  roomDataShow: true,
  blackMode: false
};

interface Option {
  label: string;
  title: string;
  description: string;
  firstDelay?: number;
  onChange: (checked: boolean) => void;
}

let roomDataTimerId: number | null = null; // 房间信息的计时器 id
const roomDataInterval = 12 * 60 * 1000; // 房间信息的间隔
const FizzHelper = () => {
  const [show, setShow] = useState(false);
  useClickAway(() => {
    setShow(false);
  }, document.querySelector('#fizz-helper'));

  const [config, setConfig, { isLoading }] = useStorage('config', defaultConfig);

  useUpdateEffect(() => {
    options.forEach(option => {
      const checked = config[option.label];
      if (option?.firstDelay) {
        setTimeout(() => {
          option.onChange(checked);
        }, option.firstDelay);
      } else {
        option.onChange(checked);
      }
    });
  }, [isLoading]);

  const options: Option[] = [
    {
      title: '默认网页全屏',
      label: 'fullPageAuto',
      description: '进入页面时选择网页全屏',
      onChange: async (checked: boolean) => {
        if (!checked) return;
        const fullPage = await getDomAsync('#room-html5-player [title="网页全屏"]');
        fullPage?.click();
      }
    },
    {
      title: '导航栏简化',
      label: 'headerSimplify',
      description: '头部导航栏简化',
      onChange: (checked: boolean) => {
        const layoutHeader = document.querySelector('.layout-Header');
        const action = checked ? 'add' : 'remove';
        layoutHeader?.classList[action]('headerSimplify');
      }
    },
    {
      title: '页面简化',
      label: 'pageSimplify',
      description: '去除页面背景,侧边栏和一些活动',
      onChange: (checked: boolean) => {
        const action = checked ? 'add' : 'remove';
        document.body.classList[action]('pageSimplify');
        const layoutPlayer = document.querySelector('.layout-Player');
        layoutPlayer?.scrollIntoView(false);
      }
    },
    {
      title: '弹幕悬停',
      label: 'barrageHover',
      description: '播放器内弹幕被选中时悬停',
      onChange: async (checked: boolean) => {
        const player = await getDomAsync('#room-html5-player');
        const action = checked ? 'remove' : 'add';
        player?.classList[action]('penetrate');
      }
    },
    {
      title: '弹幕背景隐藏',
      label: 'barrageSimplify',
      description: '隐藏滚动弹幕的横幅背景',
      onChange: async (checked: boolean) => {
        const player = await getDomAsync('#room-html5-player');
        const action = checked ? 'add' : 'remove';
        player?.classList[action]('barrageSimplify');
      }
    },
    {
      title: '礼物栏简化',
      label: 'giftSimplify',
      description: '播放器下方礼物栏简化',
      onChange: (checked: boolean) => {
        const playerToolbar = document.querySelector('.layout-Player-toolbar');
        const action = checked ? 'add' : 'remove';
        playerToolbar?.classList[action]('giftSimplify');
      }
    },
    {
      title: '聊天框简化',
      label: 'chatSimplify',
      description: '去除主播公告、贡献周榜、贵宾、粉丝团和主播通知',
      onChange: (checked: boolean) => {
        const playerAside = document.querySelector('.layout-Player-aside');
        const action = checked ? 'add' : 'remove';
        playerAside?.classList[action]('chatSimplify');
      }
    },
    {
      title: '用户铭牌隐藏',
      label: 'nameplateHide',
      description: '聊天框用户铭牌是否显示',
      onChange: (checked: boolean) => {
        const playerAside = document.querySelector('.layout-Player-aside');
        const action = checked ? 'add' : 'remove';
        playerAside?.classList[action]('barrageSimplify');
      }
    },
    {
      title: '房间数据显示',
      label: 'roomDataShow',
      description: '显示房间数据(时间范围今天00:00到今晚24:00),12分钟刷新数据一次',
      firstDelay: 5 * 1000,
      onChange: async (checked: boolean) => {
        clearInterval(roomDataTimerId);
        if (checked) {
          await getRoomData();
          roomDataTimerId = setInterval(getRoomData, roomDataInterval);
        } else {
          const lastChild = document.querySelector('.Title-row:last-child');
          lastChild && (lastChild.innerHTML = '');
        }
      }
    },
    {
      title: '暗黑模式',
      label: 'blackMode',
      description: '暗黑模式',
      onChange: (checked: boolean) => {
        const action = checked ? 'add' : 'remove';
        document.documentElement.classList[action]('dark');
      }
    }
  ];

  const getRoomData = async () => {
    const { roomData } = await sendToBackground({ name: 'roomData', body: { rid: getRid() } });
    const {
      'gift.all.price': giftAllPrice = 0,
      'gift.all.uv': giftAllUv = 0,
      'gift.paid.price': giftPaidPrice = 0,
      'gift.paid.uv': giftPaidUv = 0,
      'chat.pv': chatPv = 0,
      'chat.uv': chatUv = 0,
      'online.minutes': onlineMinutes = 0,
      'active.uv': activeUv = 0
    } = roomData;

    const firstRows = [
      ['弹幕数', chatPv],
      ['弹幕人数', chatUv],
      ['直播时间', onlineMinutes + '分'],
      ['活跃人数', activeUv]
    ];
    const secondRows = [
      ['礼物价值', formatPrice(giftAllPrice) + '元'],
      ['送礼人数', giftAllUv],
      ['付费礼物', formatPrice(giftPaidPrice) + '元'],
      ['付费人数', giftPaidUv]
    ];
    const lastTitleRow = document.querySelector('.Title-row:last-child');
    if (!lastTitleRow) return;
    lastTitleRow.innerHTML = `
      <div class='room-data'>
        ${firstRows.map(row => `<span>${row[0]}：<strong>${row[1]}</strong></span>`).join('')}
        </br>
        ${secondRows.map(row => `<span>${row[0]}：<strong>${row[1]}</strong></span>`).join('')}
      </div>`;
  };

  const optionClick = (option: Option) => {
    const checked = !config[option.label];
    setConfig({ ...config, [option.label]: checked });
    option.onChange(checked);
  };

  return (
    <>
      <Btn className='fizz-helper-btn' onClick={() => setShow(!show)} />
      <div className='fizz-helper-options' style={{ transform: `translateX(${show ? 0 : 136}px)` }}>
        {options.map((option, index) => (
          <div
            key={index}
            className={`fizz-helper-option ${config[option.label] ? 'checked' : ''}`}
            title={option.description}
            onClick={() => optionClick(option)}
          >
            {option.title}
          </div>
        ))}
      </div>
    </>
  );
};

export default FizzHelper;
