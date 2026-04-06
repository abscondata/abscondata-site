const TRADES_KEYWORDS = ["construction", "plumbing", "electrical", "hvac", "roofing"];
const FACILITIES_KEYWORDS = ["cleaning", "landscaping", "pest control", "pool", "janitorial"];
const HOME_SERVICES_KEYWORDS = ["handyman", "painting", "flooring", "remodeling", "home improvement"];

export function classifySegment(industry: string | null, employeeCount: number | null): string {
  const ind = (industry || "").toLowerCase();
  if (TRADES_KEYWORDS.some((k) => ind.includes(k))) {
    return (employeeCount && employeeCount > 10) ? "mid_trades" : "small_trades";
  }
  if (FACILITIES_KEYWORDS.some((k) => ind.includes(k))) return "facilities";
  if (HOME_SERVICES_KEYWORDS.some((k) => ind.includes(k))) return "home_services";
  return "other";
}

export function generatePersonalizationLine(
  segment: string,
  industry: string | null,
  employeeCount: number | null,
  companyName: string | null
): string {
  const ind = (industry || "service").toLowerCase();
  const emp = employeeCount || 0;
  const company = companyName || "your company";

  switch (segment) {
    case "small_trades":
      return emp > 0
        ? `Running a ${emp}-person ${ind} crew means you wear every hat — including the back-office one.`
        : `Running a ${ind} crew means you wear every hat — including the back-office one.`;
    case "mid_trades":
      return emp > 0
        ? `At ${emp} people, ${ind} companies usually hit a wall where admin work eats the owner's nights and weekends.`
        : `${ind.charAt(0).toUpperCase() + ind.slice(1)} companies at your size usually hit a wall where admin work eats the owner's nights and weekends.`;
    case "facilities":
      return `${ind.charAt(0).toUpperCase() + ind.slice(1)} businesses live and die by recurring revenue, which means follow-ups can't slip through the cracks.`;
    case "home_services":
      return `In ${ind}, the difference between a 4-star and 5-star Google rating is usually whether reviews actually get requested.`;
    default:
      return `Service businesses like ${company} usually have one person doing all the back-office work.`;
  }
}
