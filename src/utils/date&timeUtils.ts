export const formatDate = (datePosted: any) => {
  const date = new Date(datePosted);
  const options: any = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const formattedDate = date.toLocaleDateString('en-US', options);

  const hour = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hour >= 12 ? 'PM' : 'AM';

  const formattedTime = `${hour % 12}:${minutes
    .toString()
    .padStart(2, '0')} ${ampm}`;

  return `${formattedDate} | ${formattedTime}`;
};
