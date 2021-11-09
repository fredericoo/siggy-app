import { Button, Menu, MenuButton, MenuList, MenuItem, useClipboard } from '@chakra-ui/react';

type Props = {
  html?: string;
  isDisabled?: boolean;
};

const downloadFromHtml = (html: string, filename: string) => {
  if (!window) return;
  const blob = new Blob(['\ufeff', html]);
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.download = filename;
  link.target = '_blank';
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const ExportSignatureMenu: React.VFC<Props> = ({ html, isDisabled }) => {
  const { onCopy } = useClipboard(html || '');
  if (!html) return null;

  return (
    <Menu>
      <MenuButton as={Button} variant="primary" isDisabled={isDisabled}>
        Use this signature
      </MenuButton>
      <MenuList>
        <MenuItem onClick={onCopy}>Copy to clipboard</MenuItem>
        <MenuItem onClick={() => downloadFromHtml(html, 'signature.html')}>Download html file</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ExportSignatureMenu;
