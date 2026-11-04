import { demoMenu, type DemoAction, type OpsFilter } from "@/data/mobile-apps";

/** Telefon içi yerel demo durumu. Hiçbir sunucuya gönderilmez. */
export interface DemoState {
  restaurantId: string;
  cart: Record<string, number>;
  orderPlaced: boolean;
  /** 0 Alındı · 1 Hazırlanıyor · 2 Yolda · 3 Teslim edildi */
  trackStage: number;
  notificationRead: boolean;
  online: boolean;
  taskAccepted: boolean;
  /** 0 → 1 rota ilerlemesi (kurye uygulaması) */
  navStage: number;
  delivered: boolean;
  opsFilter: OpsFilter;
  openPackage: string | null;
  stockQuery: string;
  approved: string[];
}

export const initialDemoState: DemoState = {
  restaurantId: "kofteci-usta",
  cart: {},
  orderPlaced: false,
  trackStage: 0,
  notificationRead: false,
  online: false,
  taskAccepted: false,
  navStage: 0,
  delivered: false,
  opsFilter: "hepsi",
  openPackage: null,
  stockQuery: "",
  approved: [],
};

const seededCart: Record<string, number> = { "izgara-kofte": 1, ayran: 1 };

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "reset":
      return initialDemoState;
    case "selectRestaurant":
      return { ...state, restaurantId: action.id };
    case "cartAdd":
      return { ...state, cart: { ...state.cart, [action.itemId]: (state.cart[action.itemId] ?? 0) + 1 } };
    case "cartRemove": {
      const next = { ...state.cart };
      const q = (next[action.itemId] ?? 0) - 1;
      if (q <= 0) delete next[action.itemId];
      else next[action.itemId] = q;
      return { ...state, cart: next };
    }
    case "seedCart":
      return cartCount(state.cart) > 0 ? state : { ...state, cart: seededCart };
    case "placeOrder":
      if (state.orderPlaced) return state;
      return {
        ...state,
        cart: cartCount(state.cart) > 0 ? state.cart : seededCart,
        orderPlaced: true,
        trackStage: 0,
      };
    case "trackAdvance":
      return { ...state, trackStage: Math.min(3, state.trackStage + 1) };
    case "readNotification":
      return { ...state, notificationRead: true };
    case "setOnline":
      return { ...state, online: action.value };
    case "acceptTask":
      return { ...state, online: true, taskAccepted: true };
    case "navAdvance":
      return { ...state, navStage: Math.min(1, state.navStage + 1) };
    case "deliver":
      return { ...state, delivered: true, navStage: 1 };
    case "opsFilter":
      return { ...state, opsFilter: action.value };
    case "togglePackage":
      return { ...state, openPackage: state.openPackage === action.id ? null : action.id };
    case "stockQuery":
      return { ...state, stockQuery: action.value };
    case "approve":
      return state.approved.includes(action.id) ? state : { ...state, approved: [...state.approved, action.id] };
    default:
      return state;
  }
}

export function cartCount(cart: Record<string, number>) {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}

export function cartTotal(cart: Record<string, number>) {
  return demoMenu.reduce((sum, item) => sum + (cart[item.id] ?? 0) * item.price, 0);
}

export function formatTL(n: number) {
  // Deterministik binlik ayırıcı (Intl çıktısı ortamlar arası farklılaşmasın diye elle)
  return `₺${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}
