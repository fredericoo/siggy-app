import Image from 'next/image';
import { useWatch } from 'react-hook-form';

type Props = {
  fieldName: string;
  defaultValue?: string;
};

const ImagePreview: React.VFC<Props> = ({ defaultValue, fieldName }) => {
  const src = useWatch({ name: fieldName, defaultValue });
  if (!src) return null;
  return <Image src={src} height={100} width={100} alt="Preview image" unoptimized />;
};

export default ImagePreview;
