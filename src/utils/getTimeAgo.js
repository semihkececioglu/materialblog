const getTimeAgo = (dateString) => {
  const now = new Date();
  const commentTime = new Date(dateString);
  const diffMs = now - commentTime;

  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "az önce";
  if (diffMinutes < 60) return `${diffMinutes} dakika önce`;
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays === 1) return "dün";
  return `${diffDays} gün önce`;
};

export default getTimeAgo;
