import { ReactElement, ReactNode } from 'react';

interface Props {
  readonly children: ReactNode;
}

export default function Container({ children }: Props): ReactElement {
  return <div className={'flex flex-col'}>{children}</div>;
}
