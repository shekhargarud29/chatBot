import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export const Shimmer = () => {
  return (
    <div className="shimmer">
      <DotLottieReact
        src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs"
        loop
        autoplay
      />
    </div>
  );
};
