import dayjs from 'dayjs';

export const getRandomDate = (): string => {
  return dayjs().subtract(Math.floor(Math.random() * 48), 'hour').toISOString();
};

export const getCurrentDate = (): string => {
  return dayjs().toISOString();
};

export function formatCommentTime(createdAt: string, now: Date): string {
  const created = dayjs(createdAt);
  if (!created.isValid())
      return '';

  const nowDay = dayjs(now);
  const sameDay = created.isSame(nowDay, 'day');
  if (!sameDay)
      return created.format('DD/MM/YYYY');

  const diffMinutes = Math.max(0, nowDay.diff(created, 'minute'));
  if (diffMinutes < 60) {
    const mins = Math.max(1, diffMinutes);
    return `${mins} phút trước`;
  }

  const diffHours = Math.max(0, nowDay.diff(created, 'hour'));
  const hours = Math.max(1, diffHours);
  return `${hours} giờ trước`;
}

export function getTimeAgo(publishedAt: string): string {
  const now = dayjs();
  const published = dayjs(publishedAt);
  
  if (!published.isValid()) return '';
  
  const diffMinutes = now.diff(published, 'minute');
  const diffHours = now.diff(published, 'hour');
  const diffDays = now.diff(published, 'day');
  
  if (diffMinutes < 60) {
    return `${Math.max(1, diffMinutes)} phút trước`;
  } else if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  } else {
    return `${diffDays} ngày trước`;
  }
}
