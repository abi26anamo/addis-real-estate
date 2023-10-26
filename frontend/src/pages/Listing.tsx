import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { useSelector } from "react-redux";
import "swiper/css/bundle";
import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaChair,
  FaParking,
} from "react-icons/fa";
import ContactForm from "../components/ContactForm";
import { list } from "firebase/storage";

interface ListingData {
  id: string;
  name: string;
  description: string;
  regularPrice: string;
  discountPrice: string;
  imageUrls: string[];
  offer: boolean;
  type: "rent" | "sale";
  address: string;
  bedrooms: number;
  bathrooms: number;
  parking: boolean;
  furnished: boolean;
  userRef: string;
}

const Listing = () => {
  SwiperCore.use([Navigation]);
  const { currentUser } = useSelector((state: any) => state.user);
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [listing, setListing] = useState<ListingData | null>(null);
  const [copied, setCopied] = useState(false);
  const [contactClicked, setContactClicked] = useState(false);
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.id}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.id]);

  console.log("listing", listing);

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something Went Wrong</p>
      )}
      {listing && !loading && !error && (
        <Swiper navigation>
          {listing.imageUrls.map((url) => (
            <SwiperSlide key={url}>
              <div
                className="h-[550px]"
                style={{
                  background: `url(${url}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
        <FaShare
          className="text-slate-500"
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
            }, 2000);
          }}
        />
      </div>
      {copied && (
        <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
          Link copied!
        </p>
      )}
      <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
        {listing && (
          <p className="text-2xl font-semibold">
            {listing.name} - ${" "}
            {listing.offer
              ? listing.discountPrice.toLocaleString()
              : listing.regularPrice.toLocaleString()}
            {listing.type === "rent" && " / month"}
          </p>
        )}
        <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
          <FaMapMarkerAlt className="text-green-700" />
          {listing && listing.address}
        </p>
        <div className="flex gap-4">
          <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
            {listing && listing.type === "rent" ? "For Rent" : "For Sale"}
          </p>
          {listing && listing.offer && (
            <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
              ${+listing.regularPrice - +listing.discountPrice} OFF
            </p>
          )}
        </div>
        <p className="text-slate-800">
          <span className="font-semibold text-black">Description - </span>
          {listing && listing.description}
        </p>
        <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
          <li className="flex items-center gap-1 whitespace-nowrap ">
            <FaBed className="text-lg" />
            {listing && listing.bedrooms > 1
              ? `${listing.bedrooms} beds `
              : `${listing && listing.bedrooms} bed `}
          </li>
          <li className="flex items-center gap-1 whitespace-nowrap ">
            <FaBath className="text-lg" />
            {listing && listing.bathrooms > 1
              ? `${listing.bathrooms} baths `
              : `${listing && listing.bathrooms} bath `}
          </li>
          <li className="flex items-center gap-1 whitespace-nowrap ">
            <FaParking className="text-lg" />
            {listing && listing.parking ? "Parking spot" : "No Parking"}
          </li>
          <li className="flex items-center gap-1 whitespace-nowrap ">
            <FaChair className="text-lg" />
            {listing && listing.furnished ? "Furnished" : "Unfurnished"}
          </li>
        </ul>
        {currentUser && currentUser._id  !== listing?.userRef && !contactClicked && (
          <button onClick={()=>setContactClicked(true)} className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3">
            Contact Owner
          </button>
        )}
        {contactClicked && <ContactForm listing={listing } />}
      </div>
    </main>
  );
};

export default Listing;
