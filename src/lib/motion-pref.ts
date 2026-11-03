export const MOTION_STORAGE_KEY = "ts-motion-pref";

/** <head> içinde ilk boyamadan önce çalışır: kullanıcı tercihini html sınıfına yansıtır. */
export const motionPrefInitScript = `try{var p=localStorage.getItem('${MOTION_STORAGE_KEY}');var r=p==='reduce'||(p!=='full'&&matchMedia('(prefers-reduced-motion: reduce)').matches);if(r)document.documentElement.classList.add('reduce-motion')}catch(e){}`;
