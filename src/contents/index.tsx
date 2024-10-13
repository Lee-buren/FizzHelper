import styles from 'data-text:~contents/style.scss';
import type { PlasmoCSConfig, PlasmoCSUIJSXContainer, PlasmoRender } from 'plasmo';
import { createRoot } from 'react-dom/client';
import FizzHelper from '~components/FizzHelper';

export const config: PlasmoCSConfig = {
  matches: [ 'https://www.douyu.com/*' ],
  css: [ 'inject.scss' ],
};

export const getRootContainer = () => {
  const rootContainer = document.createElement('fizz-helper');
  rootContainer.setAttribute('id', 'fizz-helper');
  const shadowDom = rootContainer.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = styles;
  shadowDom.append(style);
  document.body.after(rootContainer);
  return shadowDom;
};

export const render: PlasmoRender<PlasmoCSUIJSXContainer> = async ({ createRootContainer }) => {
  const rootContainer = await createRootContainer();
  const root = createRoot(rootContainer);
  root.render(<FizzHelper />);
};
