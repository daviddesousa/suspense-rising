import ShopSection from './ShopSection';
import Carousel3D from './Carousel3D';

const SHOP_CONTENT = [
  'Meet Haslow.',
  'He speaks with charm and moves with grace,',
  'but there’s something cold beneath his smile',
  'like a man who’s witnessed nights he refuses to speak of.',
  'His eyes scan every dancefloor like he’s always preparing for someone to betray him or worse,',
  'recognize him.',
  'The closer you get to Haslow, the more it feels like you’re walking into a house without walls,',
  'just layers of smoke and mirrors...',
  // 'EVERYTHING IS SMOKE AND MIRRORS',
];

export default function Shop() {
  return (
    <main className="text-center overflow-x-hidden text-white">
      {SHOP_CONTENT.map((text, index) => (
        <ShopSection key={index} text={text} />
      ))}

      {/* spacer */}
      <div className="h-[25svh]" />

      <Carousel3D />

      {/* spacer */}
      <div className="h-[50vh]" />

      <ShopSection
        key="12321321793as89ds978ad978sa0"
        text="EVERYTHING IS SMOKE AND MIRRORS"
      />
    </main>
  );
}
