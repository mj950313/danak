export default function Youtube() {
  return (
    <div className="absolute top-[-150px] w-full h-[600px] xl:h-[800px] overflow-hidden bg-blend-overlay">
      <video
        className="w-full h-[1000px] object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/youtube.mp4" type="video/mp4" />
      </video>
      <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
        <h1 className="text-xl sm:text-3xl xl:text-5xl font-bold mb-4">
          The Thrill of the Catch, The Excitement of the Landing
        </h1>
        <p className="text-sm xl:text-2xl mb-2">
          Join a Thriving Community of Passionate Anglers
        </p>
        <p className="text-sm xl:text-2xl">
          Connect, Share, and Learn from Fellow Fishermen
        </p>
      </div>
    </div>
  );
}
