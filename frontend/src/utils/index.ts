export const getBgColor = (): string => {
    const bgarr: string[] = [
      "#b73e3e",
      "#5b45b0",
      "#7f167f",
      "#735f32",
      "#1d2569",
      "#285430",
      "#f6b100",
      "#025cca",
      "#be3e3f",
      "#02ca3a",
    ];
    const randomBg = Math.floor(Math.random() * bgarr.length);
    return bgarr[randomBg];
  };
  
  // ✅ Convert name to avatar initials
  export const getAvatarName = (name: string | undefined): string => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };
  
  // ✅ Format Date as "Month Day, Year"
  export const formatDate = (date: Date): string => {
    const months: string[] = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, "0")}, ${date.getFullYear()}`;
  };
  
  // ✅ Format Date with Time in IST (Asia/Kolkata)
  export const formatDateAndTime = (date: string | Date): string => {
    const formattedDate = new Date(date).toLocaleString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  
    return formattedDate;
  };
  