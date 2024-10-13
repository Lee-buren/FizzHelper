
/*
* 金钱格式化
* @param {number} price 价格
* @return {string} 格式化后的价格
*  */
export function formatPrice(price: number) {
  return (price / 100).toFixed(2);
}

/*
* 异步获取dom元素
* @param {string} str 选择器
* @return {Promise<HTMLElement>} 异步获取的dom元素
*  */
export async function getDomAsync(str: string): Promise<HTMLElement> {
  const selector = await new Promise<HTMLElement>((resolve) => {
    setTimeout(() => {
      const selector = document.querySelector(str) as HTMLElement;
      resolve(selector);
    }, 100);
  });
  return selector || getDomAsync(str);
}

export const getRid = () => {
  const [, roomId] = location.pathname.split('/');
  return new URLSearchParams(location.search).get('rid') ?? roomId ?? null;
};


export const getCookies = () => {
  let res = { dyshid: '', dyshci: '', ctn: '' };
  const cookieArray = document.cookie.split('; ');
  cookieArray.forEach(cookie => {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === 'acf_uid') {
      res.dyshid = Number(cookieValue).toString(16);
    }
    if (cookieName === 'acf_did') {
      res.dyshid += `-${cookieValue}`;
    }
    if (cookieName === 'acf_ccn') {
      res.ctn = cookieValue;
    }
  });
  return res;
};