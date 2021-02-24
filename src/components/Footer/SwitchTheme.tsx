import { Button, useTheme } from '@aragon/ui';
import React from 'react';

type switchThemeProps = {
  hasWeb3: boolean;
  updateTheme: Function;
};

function SwitchMode({ hasWeb3, updateTheme }: switchThemeProps) {
  const theme = useTheme();
  const isDark = theme._name === 'dark';

  const handleChangeTheme = () => {
    updateTheme(isDark ? 'light' : 'dark');
  };

  return (
    <Button
      icon={<i className={isDark ? 'far fa-moon' : 'fas fa-moon'} />}
      onClick={handleChangeTheme}
      label=''
      disabled={!hasWeb3}
      style={{ backgroundColor: theme.background }}
    />
  );
}

export default SwitchMode;
