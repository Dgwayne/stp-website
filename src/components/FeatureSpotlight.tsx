import AutoVideo from "@/components/AutoVideo";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  src: string;
  poster: string;
  flip?: boolean;
};

/**
 * One feature shown in motion: its clip on one side, its copy on the other.
 * `flip` swaps the columns so a run of these alternates left/right down the
 * page. On narrow screens the video always stacks above the text.
 */
export default function FeatureSpotlight({
  eyebrow,
  title,
  description,
  src,
  poster,
  flip = false,
}: Props) {
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
      <figure className={flip ? "lg:order-2" : ""}>
        <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
          <AutoVideo src={src} poster={poster} className="w-full" />
        </div>
      </figure>
      <div className={flip ? "lg:order-1" : ""}>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-teal">
          {eyebrow}
        </p>
        <h3 className="mb-4 text-2xl font-bold sm:text-3xl">{title}</h3>
        <p className="leading-relaxed text-muted">{description}</p>
      </div>
    </div>
  );
}
