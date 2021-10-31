import { extendTheme } from '@chakra-ui/react';
import Button from './components/Button';
import Input from './components/Input';
import Menu from './components/Menu';
import Modal from './components/Modal';
import Select from './components/Select';
import Tabs from './components/Tabs';

const colors = {
  primary: '#00ffff',
  gray: {
    50: '#fafafa',
    100: '#f0f0f0',
    200: '#DAE1E7',
    300: '#B4C2CF',
    400: '#839AAF',
    500: '#587289',
    600: '#405364',
    700: '#28343e',
    800: '#202931',
    900: '#101519',
  },
  orange: {
    100: '#FFF5EB',
    200: '#FFD29D',
    300: '#FFC685',
    400: '#FFA947',
    500: '#FF8D0A',
    600: '#CC6D00',
    700: '#A35700',
    800: '#522C00',
    900: '#291600',
  },
};

export const theme = extendTheme({
  colors,
  components: {
    Button,
    Select,
    Input,
    Tabs,
    Menu,
    Modal,
  },
});
