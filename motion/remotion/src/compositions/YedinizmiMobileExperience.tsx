import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../lib/Backdrop";
import { clamp, colors, easeInOut, easeOut } from "../lib/brand";
import { PHONE, PhoneFrame, TABLET, TabletFrame } from "../lib/devices";
import { font } from "../lib/fonts";
import { Captions, Glow, Header, StepRail } from "./yedinizmi/chrome";
import { CourierScreens } from "./yedinizmi/courier";
import { CustomerOrderScreens, CustomerTrackingScreen } from "./yedinizmi/customer";
import { RestaurantPanel } from "./yedinizmi/restaurant";
import { STAGE, T } from "./yedinizmi/timing";

/**
 * 4:5 (1080x1350) seçildi: içerik telefon ağırlıklı; dikey kadraj telefonu büyük ve
 * okunaklı tutar, mobil ekranda letterbox olmadan tam genişlikte oynar.
 */
export const YEDINIZMI_MOBILE_EXPERIENCE = {
  id: "YedinizmiMobileExperience",
  width: 1080,
  height: 1350,
  fps: 30,
  durationInFrames: 450,
} as const;

const PHONE_LEFT = STAGE.centerX - PHONE.width / 2;
const PHONE_TOP = STAGE.top;
const SPLIT_X = 205;
const SPLIT_SCALE = 0.82;

const rideProgress = (globalFrame: number) =>
  interpolate(globalFrame, [T.rideStart, T.rideEnd], [0, 1], { ...clamp, easing: easeInOut });
const deliveredAt = (globalFrame: number) => interpolate(globalFrame, [T.rideEnd, T.rideEnd + 10], [0, 1], clamp);

const CustomerScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 26], [0, 1], { ...clamp, easing: easeOut });
  const exit = interpolate(frame, [112, 132], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <PhoneFrame
      screenColor="#0D1220"
      style={{
        left: PHONE_LEFT,
        top: PHONE_TOP,
        opacity: enter * (1 - exit * 0.6),
        translate: `${-exit * 860}px ${(1 - enter) * 90}px`,
        rotate: `${-exit * 8}deg`,
      }}
    >
      <CustomerOrderScreens />
    </PhoneFrame>
  );
};

const RestaurantScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 24], [0, 1], { ...clamp, easing: easeOut });
  const exit = interpolate(frame, [108, 128], [0, 1], { ...clamp, easing: easeInOut });
  return (
    <TabletFrame
      style={{
        left: STAGE.centerX - TABLET.width / 2,
        top: (STAGE.top + STAGE.bottom) / 2 - TABLET.height / 2,
        translate: `${(1 - enter) * 1000 - exit * 1100}px 0`,
        rotate: `${(1 - enter) * 6 - exit * 6}deg`,
      }}
    >
      <RestaurantPanel />
    </TabletFrame>
  );
};

const CourierScene: React.FC = () => {
  const frame = useCurrentFrame();
  const globalFrame = frame + T.courierFrom;
  const enter = interpolate(frame, [0, 24], [0, 1], { ...clamp, easing: easeOut });
  const split = interpolate(globalFrame, [T.trackingFrom + 4, T.trackingFrom + 26], [0, 1], {
    ...clamp,
    easing: easeInOut,
  });
  return (
    <PhoneFrame
      screenColor="#0A0F1A"
      style={{
        left: PHONE_LEFT,
        top: PHONE_TOP,
        translate: `${(1 - enter) * 900 + split * SPLIT_X}px 0`,
        rotate: `${(1 - enter) * 8}deg`,
        scale: 1 - split * (1 - SPLIT_SCALE),
      }}
    >
      <CourierScreens progress={rideProgress(globalFrame)} delivered={deliveredAt(globalFrame)} globalFrame={globalFrame} />
    </PhoneFrame>
  );
};

const TrackingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const globalFrame = frame + T.trackingFrom;
  const enter = interpolate(frame, [4, 28], [0, 1], { ...clamp, easing: easeOut });
  return (
    <PhoneFrame
      screenColor="#0D1220"
      style={{
        left: PHONE_LEFT,
        top: PHONE_TOP,
        translate: `${-SPLIT_X - (1 - enter) * 760}px 0`,
        rotate: `${-(1 - enter) * 8}deg`,
        scale: SPLIT_SCALE,
      }}
    >
      <CustomerTrackingScreen
        progress={rideProgress(globalFrame)}
        delivered={deliveredAt(globalFrame)}
        globalFrame={globalFrame}
      />
    </PhoneFrame>
  );
};

export const YedinizmiMobileExperience: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ fontFamily: font.sans, color: colors.text, backgroundColor: colors.graphite }}>
      <Backdrop glow={colors.amber} glowPosition="50% 50%" gridSize={72} />
      <Glow />
      <Header />
      <StepRail />
      <Sequence name="Müşteri uygulaması" from={T.customerFrom} durationInFrames={T.customerDur}>
        <CustomerScene />
      </Sequence>
      <Sequence name="Restoran paneli" from={T.restaurantFrom} durationInFrames={T.restaurantDur}>
        <RestaurantScene />
      </Sequence>
      <Sequence name="Kurye uygulaması" from={T.courierFrom}>
        <CourierScene />
      </Sequence>
      <Sequence name="Müşteri canlı takip" from={T.trackingFrom}>
        <TrackingScene />
      </Sequence>
      <Sequence name="Altyazılar" durationInFrames={15 * fps}>
        <Captions />
      </Sequence>
    </AbsoluteFill>
  );
};
