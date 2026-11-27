/** Yayındaki kendi uygulamalarım (mağaza bağlantıları doğrulanmış olanlar). Kaynak: public/en/apps.json */
import apps from "../../public/en/apps.json";

export interface StoreApp {
  name: string;
  appStore: string | null;
  googlePlay: string | null;
}

export const storeApps = apps as StoreApp[];
