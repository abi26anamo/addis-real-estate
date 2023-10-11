import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useState } from "react";
import { app } from "../firebase";

const Listing = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    imageUrls: [] as string[],
  });
  const [uploading, setUploading] = useState(false); 
  const [uploadError, setUploadError] = useState<string | false>(false);
  const storeImage = async (file: File) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSubmit = (e: any) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls as string[]),
          });
          setUploadError(false);
     })
        .catch((err: any) => {
          setUploadError("Image upload failed(2MB max per image)");
        });
    } else {
      setUploadError("You can only upload maximum of 6 images");
      setUploading(false);
    }
  };
  console.log("formData", formData);

  const handleDelete = (index: number) => () => { 
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  }

  console.log(files);
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4" action="">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="name"
            className="border p-3 rounded-lg"
            id="name"
            min="10"
            max="62"
            required
          />
          <textarea
            placeholder="description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="Address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className=" flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                className="p-3 border-gray-300 rounded-lg"
                type="number"
                id="bedroom"
                min="1"
                max="10"
                required
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border-gray-300 rounded-lg"
                type="number"
                id="bath"
                min="1"
                max="10"
                required
              />
              <p>Bath</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border-gray-300 rounded-lg"
                type="number"
                id="price"
                min="1"
                max="10"
                required
              />
              <div className="flex flex-col items-center">
                <p>Price</p>
                <span className="text-xs">
                  <p>($ / month)</p>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="p-3 border-gray-300 rounded-lg"
                type="number"
                id="discount"
                min="1"
                max="10"
                required
              />
              <div className="flex flex-col items-center">
                <p>Discount Price</p>
                <span className="text-xs">
                  <p>($ / month)</p>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold text-gray-600 ml-2  ">
            Images:
            <span>The first image will be the cover (max 6)</span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(Array.from(e.target.files!))}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
          {formData.imageUrls.length > 0 && (
            <div className="flex flex-col gap-4">
              {formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className="flex justify-between p-3  items-center "
                >
                  <img
                    src={url}
                    alt="uploaded"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    onClick={handleDelete(index)}
                    type="button"
                    className="p-3 text-red-700 rounded-lg hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
          <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:shadow-lg disabled:opacity-80  ">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default Listing;
