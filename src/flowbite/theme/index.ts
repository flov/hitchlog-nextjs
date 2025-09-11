import {
  FlowbiteAlertTheme,
  FlowbiteBadgeTheme,
  FlowbiteButtonTheme,
  FlowbiteTheme,
} from 'flowbite-react';

import { DeepPartial } from '@/types/DeepPartial';

import { alertTheme } from './alertTheme';
import { badgeTheme } from './badgeTheme';
import { buttonTheme } from '../Button';

interface CustomFlowbiteTheme extends DeepPartial<FlowbiteTheme> {
  badge: FlowbiteBadgeTheme;
  button: FlowbiteButtonTheme;
  alert: FlowbiteAlertTheme;
}

export const theme: CustomFlowbiteTheme = {
  badge: badgeTheme,
  button: buttonTheme,
  alert: alertTheme,
};
