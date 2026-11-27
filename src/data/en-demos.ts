/**
 * /en demo galerisi: tunahansirin.com/demo altındaki konsept sitelerden seçilenler.
 * Ekran görüntüleri public/en/demos/<slug>.jpg, liste public/en/demos/demos.json.
 * Demolar sunucuda ayrı (statik) yayınlanır; bu uygulama yalnızca bağlantı verir.
 */
import demos from "../../public/en/demos/demos.json";

export interface Demo {
  slug: string;
  name: string;
  location: string;
  category: string;
  url: string;
}

export const demoSites = (demos as Demo[]).map((d) => ({ ...d, image: `/en/demos/${d.slug}.jpg` }));
export const allDemosUrl = "/demo/";
