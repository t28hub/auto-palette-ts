import React, { ReactElement } from 'react';
import { FaGithub } from 'react-icons/all';

export default function Header(): ReactElement {
  return (
    <header className={'py-2'}>
      <div className={'flex flex-row items-center justify-between'}>
        <div className={'prose prose-2xl font-bold'}>
          Auto Palette
        </div>

        <ul className={'flex flex-row'}>
          <li className={'hover:opacity-20 duration-300'}>
            <a href="https://github.com/t28hub/auto-palette" target="_blank" rel="noreferrer" aria-label="github">
              <FaGithub className={'text-2xl'} />
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};
