export type AppConfigData = {
  data: AppConfigData;
  numberOfTabs: number;
  showDrawer: boolean;
  splashScreenBrandingText: string;
  primary_color: string;
  secondary_color: string;
  primary_text_color: string;
  secondary_text_color: string;
  background_color: string;
  header_color: string;
  footer_color: string;
  logo_image: string;
  splash_image: string;
  tabs: {
    tabName: string;
    tabLabel: string;
    isHide: boolean;
  }[];
};
