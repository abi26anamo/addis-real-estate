import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingCard from "../components/ListingCard";

interface Listing {
  _id: string;
  name: string;
  address: string;
  description: string;
  imageUrls: string[];
  regularPrice: number;
  discountPrice: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  offer: boolean;
}

const Home = () => {
  SwiperCore.use([Navigation]);
  const [offers, setOffers] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOffers(data);
        fetchRentals();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentals = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentals(data);
        fetchSales();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSales = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSales(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOffers();
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Welcome to <span className="text-slate-500">Addis RealEstate</span>
          <br />
          <span className="text-slate-700">Find your dream home</span>
        </h1>
        <p className="text-slate-700 text-xs sm:text-sm">
          Gift Real Estate is a real estate company that offers a wide range of
          services <br />
          We have a wide range of properties for sale and rent
        </p>
        <Link
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
          to={"/search"}
        >
          Let's get started
        </Link>
      </div>
      <Swiper navigation>
        {offers &&
          offers.length > 0 &&
          offers.map((listing: Listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      <div className="max-w-6xl mx-auto flex flex-col gap-8 my-10">
        {offers && offers.length > 0 && (
          <div className=" my-3">
            <div>
              <h2 className="text-2xl font-semibold text-slate-600">Recent Offers</h2>
              <Link className="text-sm text-blue-800 hover:underline" to={"/search?offer=true"}>Show More offers</Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offers.map((listing: Listing) => (
                <ListingCard listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
        {rentals && rentals.length > 0 && (
          <div className=" my-3">
            <div>
              <h2 className="text-2xl font-semibold text-slate-600">Recent Places for rent</h2>
              <Link className="text-sm text-blue-800 hover:underline" to={"/search?offer=true"}>Show More places for rent</Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offers.map((listing: Listing) => (
                <ListingCard listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
        {sales && sales.length > 0 && (
          <div className=" my-3">
            <div>
              <h2 className="text-2xl font-semibold text-slate-600">Recent Places for sale</h2>
              <Link className="text-sm text-blue-800 hover:underline" to={"/search?offer=true"}>Show More places for sale</Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offers.map((listing: Listing) => (
                <ListingCard listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
