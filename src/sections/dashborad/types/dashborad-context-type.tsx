export type DashboardDetails = {
  number_of_campaigns: number;
  total_mail_sent: number;
  total_mail_opened: number;
  unique_targets: number;
  campaigns_percent_increase: number;
  mails_sent_percent_increase: number;
  mails_opened_percent_increase: number;
  unique_targets_percent_increase: number;
};

export type DashboardContent = {
  details: DashboardDetails;
};

export type DashboardContextValue = {
  details: DashboardDetails;
  onSetDashboardDetails: (details: DashboardDetails) => void;
};
