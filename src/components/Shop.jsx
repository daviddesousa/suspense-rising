import ShopSection from './ShopSection';

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

      {/* Added a final spacer for scroll headroom */}
      <div className="h-svh" />
    </main>
  );
}
