import Image from "next/image";

export type Screenshot = {
  src: string;
  alt: string;
  caption: string;
};

export default function ScreenshotStrip({
  screenshots,
}: {
  screenshots: Screenshot[];
}) {
  return (
    <div className="screenshot-scroll px-4">
      {screenshots.map((s) => (
        <div key={s.src} className="flex flex-col items-center gap-3">
          <div className="phone-frame">
            <Image
              src={s.src}
              alt={s.alt}
              width={440}
              height={960}
              className="object-cover"
            />
          </div>
          <p className="w-52 text-center text-xs leading-relaxed text-muted">
            {s.caption}
          </p>
        </div>
      ))}
    </div>
  );
}
