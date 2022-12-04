import Image from "next/image";

const Map = ({ lat, lng }) => {
  return (
    <Image
      src={`https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/static/pin-s+ff0000(${lng},${lat})/${lng},${lat},12,0/600x600?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`}
      alt="Static map image"
      width={600}
      height={600}
      className="rounded"
    />
  );
};

export default Map;
