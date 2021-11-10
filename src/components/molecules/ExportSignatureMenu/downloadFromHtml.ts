const downloadFromHtml = (html: string, filename: string): void => {
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

export default downloadFromHtml;
