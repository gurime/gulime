'use client'
import React, { ChangeEvent, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { BeatLoader } from 'react-spinners';
import { auth } from '@/app/firebase/firebase';
import { addDoc, collection, doc, getDoc, getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

interface UserData {
firstName: string;
lastName: string;
}

const AdminForm: React.FC = () => {
const [content, setContent] = useState<string>('');
const [title, setTitle] = useState<string>('');
const [price, setPrice] = useState<string>('');
// Pictures
const [img_showcase, setimg_Showcase] = useState<File | null>(null);
const [img_showcase1, setimg_Showcase1] = useState<File | null>(null);
const [img_showcase2, setimg_Showcase2] = useState<File | null>(null);
const [img_showcase3, setimg_Showcase3] = useState<File | null>(null);
const [img_showcase4, setimg_Showcase4] = useState<File | null>(null);
const [cover_image, setCover_Image] = useState<File | null>(null);
 // Pictures
const [articleId, setArticleId] = useState<string>('');
const [selectedCollection, setSelectedCollection] = useState<string>(' Dashboard');
const acceptedCollections = [
'Dashboard',

];
const [catorgory, setCatorgory] = useState<string>('');
const [isLoading, setIsLoading] = useState<boolean>(true);
const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
const [names, setNames] = useState<string[]>([]);
const [errorMessage, setErrorMessage] = useState<string>('');
const router = useRouter();

useEffect(() => {
const unsubscribe = auth.onAuthStateChanged(async (user) => {
const getUserData = async (userId: string): Promise<UserData | null> => {
try {
const db = getFirestore();
const userDocRef = doc(db, 'adminusers', userId);
const userDocSnapshot = await getDoc(userDocRef);
if (userDocSnapshot.exists()) {
const userData = userDocSnapshot.data() as UserData;
return userData;
} else {
return null;
}
} catch (error) {
throw error;
}
};
setIsSignedIn(!!user);
if (user) {
try {
const userData = await getUserData(user.uid);
if (userData) {
setNames([userData.firstName, userData.lastName]);
}
} catch (error) {
handleError(error);
} finally {
setIsLoading(false);
}
}
});
return () => unsubscribe();
}, []);

const handleError = (error: any) => {
if (error.code === 'network-error') {
setErrorMessage('Network error: Please check your internet connection.');
} else if (error.code === 'invalid-content') {
setErrorMessage('Invalid comment content. Please try again.');
} else {
setErrorMessage('Unexpected error occurred. Please try again later.');
}
};

const handleFileChange = (setter: (file: File | null) => void) => (e: ChangeEvent<HTMLInputElement>) => {
const file = e.target.files ? e.target.files[0] : null;setter(file);};

const storage = getStorage(); // Initialize Firebase Storage
const handleFileUpload = async (file: File, storagePath: string): Promise<string> => {
try {
const storageRef = ref(storage, storagePath);
await uploadBytesResumable(storageRef, file);
const downloadURL = await getDownloadURL(storageRef);
return downloadURL;
} catch (error) {
throw error;
}
};
const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
try {
if (!isSignedIn) {
setErrorMessage('You must be signed in to submit the article.');
return;
}
const authInstance = getAuth();
const user = authInstance.currentUser;
setIsLoading(true);
const uniqueArticleId = uuidv4();
setArticleId(uniqueArticleId);

const imgshowcase = img_showcase ? await handleFileUpload(img_showcase, `images/${uniqueArticleId}img_showcase.jpg`) : null;
const imgshowcase1 = img_showcase1 ? await handleFileUpload(img_showcase1, `images/${uniqueArticleId}img_showcase1.jpg`) : null;
const imgshowcase2 = img_showcase2 ? await handleFileUpload(img_showcase2, `images/${uniqueArticleId}img_showcase2.jpg`) : null;
const imgshowcase3 = img_showcase3 ? await handleFileUpload(img_showcase3, `images/${uniqueArticleId}img_showcase3.jpg`) : null;
const imgshowcase4 = img_showcase4 ? await handleFileUpload(img_showcase4, `images/${uniqueArticleId}img_showcase4.jpg`) : null;
const coverimage = cover_image ? await handleFileUpload(cover_image, `images/${uniqueArticleId}cover_image.jpg`) : null;
const db = getFirestore();
const docRef = await addDoc(collection(db, selectedCollection), {
userId: user?.uid,
content,
catorgory,
title,
price,
coverimage,
imgshowcase,
imgshowcase1,
imgshowcase2,
imgshowcase3,
imgshowcase4,
propertyType: selectedCollection,
timestamp: new Date(),
userEmail: user?.email,
});
if (acceptedCollections.includes(selectedCollection)) {
switch (selectedCollection) {
case 'Dashboard':
router.push('/');
break;
default:
router.push('/not-found');
break;
}
} else {
setErrorMessage('Invalid collection selected.');
setTimeout(() => {
setErrorMessage('');
}, 3000);
}
} finally {
setIsLoading(false);
}
};

  return (
<>
<div className="adminform_bg">
<form className="adminform" onSubmit={handleSubmit}>
<div style={{ color: '#fff', textAlign: 'center' }}>
<h2>Product Management System:</h2>
</div>
<div className='sm-adminform' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
<div className='sm-adminform-input' style={{ display: 'grid', gap: '1rem' }}>
<label htmlFor="selectedCollection">Choose Destination for Product:</label>
<select
name="selectedCollection"
value={selectedCollection}
onChange={(e) => setSelectedCollection(e.target.value)}
required
className='billingselect'>
<option value="">select product destination</option>
<option value="Dashboard">Dashboard</option>
<option value="Technology">Technology</option>
<option value="Music">Music</option>
<option value="Sports">Sports</option>
<option value="Toys">Toys, Kids, & Baby</option>
<option value="HomeGarden">Home & Garden</option>
<option value="Fashion">Fashion</option>
<option value="School">School Essentials</option>
<option value="Cameras">Cameras & Photography</option>
<option value="Groceries">Food & Groceries</option>
<option value="Makeup">Beauty & Makeup</option>
<option value="Clothing">Clothing & Appareal</option>
<option value="Luggage">Luggage & Suitcases</option>
<option value="Books">Books & Literature</option>
<option value="Automotive">Automotive & Industrial</option>
<option value="Cars">Cars & Trucks</option>
<option value="House">Home & Garden</option>
<option value="Pets">Pet Supplies</option>
<option value="Fitness">Fitness Products</option>
<option value="Electronics">Electronics & Gadgets</option>
<option value="religion">Faith & Religion</option>
<option value="outdoors">Outdoors & Hiking</option>
<option value="pride">Pride Shop</option>
<option value="Mental">Mental Health Products</option>
<option value="Childrens">Children's Health Products</option>
<option value="Heart">Heart Health Products</option>
<option value="Pet">Pet Health Products</option>
<option value="Eye">Eye Health Products</option>
<option value="Vitamins">Vitamins & Supplements</option>
<option value="Medical">Medical Research Products</option>
<option value="FitnessNutrition">Fitness & Nutrition</option>
<option value="OralHealth">Oral Health Products</option>
<option value="MexicanProducts">Mexican Products</option>
<option value="AustralianProducts">Australian Products</option>
<option value="SouthAmericanProducts">South American Products</option>
<option value="EuropeanProducts">European Products</option>
<option value="AsianProducts">Asian Products</option>
<option value="AfricanProducts">African Products</option>
<option value="NorthAmericanProducts">North American Products</option>
<option value="MiddleEasternProducts">Middle Eastern Products</option>
<option value="IslandProducts">Island Products</option>
</select>
</div>

<div className='sm-adminform-input' style={{ display: 'grid', gap: '1rem' }}>
<label htmlFor="catorgory">Select Product Type:</label>
<select
name="catorgory"
value={catorgory}
onChange={(e) => setCatorgory(e.target.value)}
required
className='billingselect'>
<option value="">select product type</option>
<option value="Technology">Technology</option>
<option value="Music">Music</option>
<option value="Sports">Sports</option>
<option value="Toys">Toys, Kids, & Baby</option>
<option value="HomeGarden">Home & Garden</option>
<option value="Fashion">Fashion</option>
<option value="School">School Essentials</option>
<option value="Cameras">Cameras & Photography</option>
<option value="Groceries">Food & Groceries</option>
<option value="Makeup">Beauty & Makeup</option>
<option value="Clothing">Clothing & Appareal</option>
<option value="Luggage">Luggage & Suitcases</option>
<option value="Books">Books & Literature</option>
<option value="Automotive">Automotive & Industrial</option>
<option value="Cars">Cars & Trucks</option>
<option value="House">Home & Garden</option>
<option value="Pets">Pet Supplies</option>
<option value="Fitness">Fitness Products</option>
<option value="Electronics">Electronics & Gadgets</option>
<option value="religion">Faith & Religion</option>
<option value="outdoors">Outdoors & Hiking</option>
<option value="pride">Pride Shop</option>
<option value="Mental">Mental Health Products</option>
<option value="Childrens">Children's Health Products</option>
<option value="Heart">Heart Health Products</option>
<option value="Pet">Pet Health Products</option>
<option value="Eye">Eye Health Products</option>
<option value="Vitamins">Vitamins & Supplements</option>
<option value="Medical">Medical Research Products</option>
<option value="FitnessNutrition">Fitness & Nutrition</option>
<option value="OralHealth">Oral Health Products</option>
<option value="MexicanProducts">Mexican Products</option>
<option value="AustralianProducts">Australian Products</option>
<option value="SouthAmericanProducts">South American Products</option>
<option value="EuropeanProducts">European Products</option>
<option value="AsianProducts">Asian Products</option>
<option value="AfricanProducts">African Products</option>
<option value="NorthAmericanProducts">North American Products</option>
<option value="MiddleEasternProducts">Middle Eastern Products</option>
<option value="IslandProducts">Island Products</option>
</select>
</div>
</div>
<hr />
<div style={{ color: '#fff', textAlign: 'center' }}>
<h2>Product Price:</h2>
</div>

<div className='sm-adminform' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
<div className='sm-adminform-input' style={{ display: 'grid', gap: '1rem' }}>

<input
  name="price" 
  value={price}
  onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
  required
/>


</div>
</div>
<hr />
<div style={{ color: '#fff', textAlign: 'center' }}>
<h2>Product Title:</h2>
</div>
<div className='sm-adminform' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
<div className='sm-adminform-input' style={{ display: 'grid', gap: '1rem' }}>

<textarea 
name="title" 
placeholder="Enter the Article Title.."
rows={5}
cols={100}
value={title}
onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setTitle(e.target.value)}
required>
</textarea>
</div>
</div>
<hr />



<div className="sm-adminform" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly',flexWrap:'wrap' }}>          
<div style={{ display: 'grid', gap: '1rem',marginBottom:'10rem' }}>
<label htmlFor="cover_image">Feature Product Image: </label>
<input
type="file"
id="cover_image"
name="cover_image"
accept="image/*"
onChange={handleFileChange(setCover_Image)}/>
</div> 

<div style={{ display: 'grid', gap: '1rem',marginBottom:'10rem' }}>
<label htmlFor="img_Showcase"> Product Image: </label>
<input
type="file"
id="img_Showcase"
name="img_Showcase"
accept="image/*"
onChange={handleFileChange(setimg_Showcase)}/>
</div> 
<div style={{ display: 'grid', gap: '1rem',marginBottom:'10rem' }}>
<label htmlFor="img_Showcase"> Product Image: </label>
<input
type="file"
id="img_Showcase"
name="img_Showcase"
accept="image/*"
onChange={handleFileChange(setimg_Showcase1)}/>
</div> 
<div style={{ display: 'grid', gap: '1rem',marginBottom:'10rem' }}>
<label htmlFor="img_Showcase"> Product Image: </label>
<input
type="file"
id="img_Showcase"
name="img_Showcase"
accept="image/*"
onChange={handleFileChange(setimg_Showcase2)}/>
</div> 
<div style={{ display: 'grid', gap: '1rem',marginBottom:'10rem' }}>
<label htmlFor="img_Showcase"> Product Image: </label>
<input
type="file"
id="img_Showcase"
name="img_Showcase"
accept="image/*"
onChange={handleFileChange(setimg_Showcase3)}/>
</div> 
<div style={{ display: 'grid', gap: '1rem',marginBottom:'10rem' }}>
<label htmlFor="img_Showcase"> Product Image: </label>
<input
type="file"
id="img_Showcase"
name="img_Showcase"
accept="image/*"
onChange={handleFileChange(setimg_Showcase4)}/>
</div> 
</div>

<hr />
<div style={{ color: '#fff', textAlign: 'center' }}>
<h2>Product Details</h2>
</div>

<div className="sm-adminform" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
<div style={{ display: 'grid', gap: '1rem', width: '100%' }}>
<textarea
rows={10}
placeholder="Enter Product Details..."
value={content}
onChange={(e) => setContent(e.target.value)}>
</textarea>
</div>
</div>
<hr />




<button type="submit" disabled={!isSignedIn || !content || !selectedCollection || isLoading}>
{isLoading ? (
<BeatLoader color={"#ffffff"} loading={isLoading} size={10} />
) : (
'Submit Product'
)}
</button>
</form>
</div>
</>
);
};

export default AdminForm