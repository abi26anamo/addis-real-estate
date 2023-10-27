import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ListingData {
  userRef: string;
  listing: any;
  username: string;
  name: string;
}

interface Owner {
  username: string;
  email: string;
  phone: string;
}

const ContactForm = ({ listing }: { listing: ListingData }) => {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [message, setMessage] = useState<
    string | number | readonly string[] | undefined
  >(undefined);
  const onChangeHandler = (e: any) => {
    setMessage(e.target.value);
  };
  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        if (data.success === false) {
          return;
        }
        setOwner(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOwner();
  }, [listing.userRef]);

  return (
    <>
      {owner && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="semi-bold">{owner && owner.username}</span>{" "}
            for <span>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            className="w-full border-green p-3 rounded-lg"
            onChange={onChangeHandler}
            name="message"
            id="message"
            placeholder="Enter your message here..."
            value={message}
          ></textarea>
          <Link
            to={`mailto:${owner.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};
export default ContactForm;      
